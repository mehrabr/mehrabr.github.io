---
layout: post
title: "Building waddler, or, do we actually need Spark for this?"
date: 2025-05-27 09:00:00 -0700
categories: [Projects, Data Engineering]
tags: [go, duckdb, etl, motherduck, waddler]
---

Most of what I was doing in the transformer was things I'd just write as SQL.

I was on a client project in Texas and had a scratch-pad pipeline going on the side: read some CSVs, transforms in pandas, write out Parquet. Then I looked at the transformer. Filter out negatives, uppercase a column, group and sum, sort descending — a handful of pandas methods I looked up every time. In SQL it's one SELECT statement, and I already know SQL. The question I couldn't stop thinking about: why am I translating this into pandas at all?

The result is [waddler](https://github.com/mehrabr/waddler), a Go binary that runs ETL pipelines from a YAML file using DuckDB as the query engine.

---

I.

SQLite is a relational database in a file, optimized for transactional patterns: small reads and writes, indexed lookups. DuckDB is an analytical database in a file, optimized for data engineering — wide tables, aggregations, joins across files of different formats. Things that would be painful in SQLite, and that in Spark require spinning up a cluster.

What surprised me was what DuckDB does at the file level. You don't load a CSV into DuckDB and then query it; you query the CSV directly, DuckDB figures out the schema, reads it lazily, and processes it with a vectorized engine. Same for Parquet, JSON, S3-hosted files. `GROUP BY ALL` infers every non-aggregate column automatically — it removes a whole category of typos in user-written SQL.

I'd been mentally filing DuckDB as a query tool over Parquet. It's the query engine for pipelines that don't need a cluster.

---

II.

I had the Python version working. Distribution pushed me toward Go.

A Python tool means the user has Python — the right version, a virtualenv, `pip install`. For the user I was designing for, a volunteer data coordinator at a food bank with CSVs and no engineering background, that chain has too many failure points. A Go binary is one file. Download it and run it.

The CGO requirement is the one tradeoff I'd redo. DuckDB's Go driver statically links the C++ library, so cross-compilation is complicated. Pre-built binaries via GitHub Releases is the answer; I haven't gotten there yet.

---

III.

The user interface is a YAML file:

```yaml
name: monthly-donor-report

sources:
  - name: donations
    type: csv
    path: data/donations_2024.csv
  - name: donors
    type: csv
    path: data/donors.csv

transform: |
  SELECT
    d.donor_id,
    dn.name,
    ROUND(SUM(d.amount), 2) AS total_donated,
    CASE
      WHEN SUM(d.amount) >= 1000 THEN 'major'
      WHEN SUM(d.amount) >= 100  THEN 'regular'
      ELSE 'small'
    END AS donor_tier
  FROM donations d
  JOIN donors dn USING (donor_id)
  WHERE d.amount > 0
  GROUP BY ALL
  ORDER BY total_donated DESC

output:
  type: parquet
  path: output/donor_report.parquet
```

DuckDB registers each source as a named view. The transform references them directly. Nothing persists between runs.

Inline SQL keeps everything in one file. The target user can write a SELECT statement but probably can't navigate a multi-file project structure. A `transform_file:` option alongside inline SQL is the natural addition for transforms with many CTEs.

---

IV.

The failure mode I was worried about wasn't bad SQL — DuckDB catches that with a clear error. It was silent bad data. A join that returns zero rows because someone renamed a column upstream. Totals that went negative because a refund was entered with the wrong sign. An output file that's technically valid Parquet but contains garbage.

The `validate` block:

```yaml
validate:
  - name: no negative totals
    sql: SELECT COUNT(*) FROM ({transform}) WHERE total_donated < 0
    expect: 0

  - name: at least one major donor
    sql: SELECT COUNT(*) FROM ({transform})
    expect_min: 1
```

`{transform}` substitutes the pipeline's SQL at runtime, so validation runs against the same result without materializing it twice. A failing rule halts the pipeline before writing anything.

---

V.

The pattern in small-org data infrastructure: a spreadsheet updated every Monday, one technical person on the team, no idea what a cloud scheduler costs. The `schedule` field and `serve` subcommand:

```yaml
schedule: "0 6 * * *"
```

```bash
waddler serve pipeline.yml
```

Drop it in a systemd service on a cheap VPS and it runs until killed. Cron syntax is right for people who know cron; named presets like `schedule: daily` would serve the coordinator better and are a small change on the implementation side.

---

Waddler is [on GitHub](https://github.com/mehrabr/waddler) under MIT. Source types: CSV, JSON, Parquet, Postgres, MotherDuck. Output types: Parquet, CSV, MotherDuck.

```bash
CGO_ENABLED=1 go install github.com/mehrabr/waddler/cmd/waddler@latest
```

Most analytical workloads that live on a Spark cluster would run just fine on a single machine. The pipeline is SQL. The YAML is just the envelope.
