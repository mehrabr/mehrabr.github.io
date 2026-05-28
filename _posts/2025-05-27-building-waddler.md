---
layout: post
title: "Building waddler, or, do we actually need Spark for this?"
date: 2025-05-27 09:00:00 -0700
categories: [Projects, Data Engineering]
tags: [go, duckdb, etl, motherduck, waddler]
---

I've been doing data engineering work for a while now, mostly on the heavier end of things: Spark clusters, Databricks, the kind of infrastructure that costs a lot and takes a team to maintain. Lately I've been wondering how much of that complexity is actually load-bearing versus how much of it we just drag along out of habit.

The question came into focus for me earlier this year while I was on-site with a client in Texas, working through what should have been a fairly ordinary data pipeline, and a friend who works at MotherDuck brought up something that stuck with me: most analytical workloads that live on a Spark cluster would run just fine on a single machine, and they'd run faster and cost less and require no infrastructure to maintain. That's basically MotherDuck's whole thesis, and I found myself wanting to actually test it by building something.

So I started a small project to find out. The result is [waddler](https://github.com/mehrabr/waddler), a Go binary that runs ETL pipelines from a YAML file using DuckDB as the query engine. No Python environment, no cluster, no orchestration platform. I wanted to write up the process of getting there because I'm still not totally sure I made all the right calls, and it might be interesting to think through.

---

## Starting small on purpose

I've always appreciated minimalist code projects, maybe more than is strictly rational. There's something about the constraint that reveals a lot, both about the problem and about what you actually know. When you strip away the framework and the boilerplate and the abstractions you're used to reaching for, you find out pretty quickly which parts of your understanding are solid and which parts were load-bearing on tools you didn't realize you were leaning on. I learn best this way, honestly, building something small enough to hold in your head all at once and then seeing where it gets complicated.

That's how I started this one. While working on that Texas project earlier this year, I was putting together a quick Python pipeline on the side as a scratch-pad: read some CSVs, do some transforms with pandas, write out Parquet. Clean structure, extractor and transformer and loader and a pipeline runner, pytest coverage. The whole thing fit comfortably in a handful of files.

It worked fine, but building it made me realize something a little embarrassing: most of what I was doing in the transformer was things you'd just write as SQL. Filter out negatives, uppercase a column, group and sum, sort descending. In pandas that's maybe fifteen lines and four or five method calls you have to look up every time. In SQL it's just a SELECT statement, and I already know SQL. So the question I couldn't stop thinking about was: why am I translating this into pandas at all? What is pandas giving me here that a database wouldn't?

---

## DuckDB is a weird and interesting answer to that question

I'd used DuckDB before but mostly as a query tool over Parquet files, not as something to build on top of. The more I dug into it the more I realized it's kind of a different category of thing than what I was mentally filing it under.

The comparison that clicked for me: SQLite is a relational database in a file, optimized for the transactional patterns that show up in applications, lots of small reads and writes, indexed lookups, that kind of thing. DuckDB is an analytical database in a file, optimized for the patterns that show up in data engineering: wide tables, aggregations, joins across files of different formats. Things that would be painful in SQLite, and that in Spark require spinning up a cluster just to get started.

The part that actually surprised me was how much DuckDB handles at the file level. You don't load a CSV into DuckDB and then query it; you just query the CSV directly, and DuckDB figures out the schema, reads it lazily, and processes it with a vectorized engine. Same for Parquet, JSON, S3-hosted files. I kept expecting to hit a step where I had to do some plumbing and there just... wasn't one.

`GROUP BY ALL` is also genuinely nice. Instead of listing every non-aggregate column in your GROUP BY clause you just say ALL and DuckDB infers it. Small thing, but it reduces a whole category of typos in user-written SQL, which matters a lot when your target user isn't a data engineer writing this themselves.

Is DuckDB the right choice for every ETL workload? Obviously not, and I'm curious where the actual ceiling is in practice. The docs say it handles hundreds of gigabytes on a laptop, which sounds right to me, but I haven't really stress-tested it. For the small-org use case I was targeting it seemed like the right call. Anyone pushed it to its limits on a real workload?

---

## Why Go, and was that actually the right call?

I went back and forth on this. I had the Python version already working. I know Python well. Going back to Go meant brushing up on things I'd let go rusty: the module system has changed a lot since the last time I built a standalone tool, and I had to relearn some stdlib patterns like `log/slog` and how the `database/sql` interface works for non-standard drivers like go-duckdb.

The thing that pushed me toward Go was distribution. A Python tool means the user has to have Python, and the right version of Python, and a virtualenv, and `pip install` has to work. For the user I was imagining, a volunteer data coordinator at a food bank, someone with CSVs and no engineering background, that chain has a lot of failure points. A Go binary is one file. You download it and run it. That story is much simpler.

Go also forced me to think carefully about structure in a way Python doesn't really. The `cmd/` directory for the binary, `internal/` for packages you don't want exported, `testdata/` for fixtures; these are conventions the community has settled on and I think they're good ones, but Go doesn't enforce them so you have to consciously choose them. I followed them mostly because I was building something I hoped other engineers would read, and there's value in code that looks like what people expect.

The CGO requirement is the one thing I'd redo if I could. DuckDB's Go driver statically links the C++ library, which means you need a C compiler to build, and cross-compilation gets complicated fast. I have platform-specific build instructions in the README but pre-built binaries via GitHub Releases is the real answer and I haven't gotten there yet. If you've found a clean CI workflow for shipping CGO binaries across platforms I'd genuinely love to know; it's the main piece of friction left.

---

## The design: YAML as the user interface

The core of waddler is that the user writes a YAML file, not code. A pipeline looks like this:

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

The `transform` field is just SQL. DuckDB registers each source as a named view, so the SQL can reference `donations` and `donors` directly. When the pipeline runs it creates an in-memory DuckDB connection, registers the views, runs the transform, and writes the output. Nothing persists between runs.

I thought a lot about whether to make the transform field a path to a `.sql` file instead of inline SQL, or whether to support some kind of higher-level DSL. I went with inline SQL for now because it keeps everything in one file and the target user is someone who can write a SELECT statement but probably can't navigate a multi-file project structure. But I'm not totally sure this was right; for complex transforms with lots of CTEs, inline YAML gets unwieldy pretty fast. A `transform_file: transforms/clean_donors.sql` option alongside inline SQL seems like a natural addition, or maybe both, where the file takes precedence if provided. Curious if anyone has a strong opinion here.

---

## The package structure, and one decision I'm still thinking about

The Go internals break into five packages: `config` owns the YAML schema and validation, `engine` wraps the DuckDB connection, `source` maps source types to `CREATE VIEW` statements, `loader` handles output, and `runner` orchestrates everything.

The source package is where I'm most uncertain about extensibility. Right now adding a new source type is just adding a case to a switch statement in `source.go` and nothing else changes, which I like. But as the number of source types grows, SQLite, MySQL, maybe Excel files eventually, a switch statement starts to feel like the wrong shape for it. A plugin-style pattern where each source type registers itself in `init()` might scale better but adds indirection that makes the code harder to follow. Not sure which tradeoff I prefer at this scale.

The `engine` package being a thin interface means you can test the config and runner packages with a mock, which is good and was a deliberate choice. But it also means the engine interface leaks DuckDB-specific concerns, like `ExportParquet`, into what's supposed to be an abstraction. I've been going back and forth on whether the right answer is a more generic interface with DuckDB-specific stuff pushed into the loader, or whether that's overengineering for something that's always going to use DuckDB. Leaning toward probably overengineering for now.

---

## Validation rules: the thing I didn't plan for

Partway through building the runner I realized the failure mode I'd been worried about wasn't bad SQL; the DuckDB driver catches that immediately with a clear error. It was silent bad data. A join that returns zero rows because someone renamed a column upstream. Totals that went negative because a refund got entered the wrong sign. An output file that's technically valid Parquet but contains garbage.

So I added a `validate` block:

```yaml
validate:
  - name: no negative totals
    sql: SELECT COUNT(*) FROM ({transform}) WHERE total_donated < 0
    expect: 0

  - name: at least one major donor
    sql: SELECT COUNT(*) FROM ({transform})
    expect_min: 1
```

The `{transform}` placeholder substitutes the pipeline's actual SQL at runtime, so validation queries run against the same result without materializing it twice. If a rule fails the pipeline halts before writing anything; you get an error, not a corrupted output file that someone might not notice for a week.

I'm pretty happy with how this turned out. It's simple enough that a non-engineer can express their expectations ("there should never be negative amounts"), but composable enough for subtle data quality checks too. One thing I'm still undecided on: should failing validation be a hard stop, or should there be a `warn_only` mode that logs and continues? There are real cases where you want to know about a problem but still want the output. Feels like it should be a flag, but I'm not sure I want to encourage pipelines that knowingly emit bad data either. What do you think?

---

## Scheduling, because the last mile is always the hardest

The pattern I kept seeing in conversations about small org data infrastructure: they have a spreadsheet or CSV that gets updated every Monday, they want it processed and queryable by Monday morning, and the one technical person on the team has no idea how to configure a cron job or what a cloud scheduler costs. So I added a `schedule` field and a `serve` subcommand.

```yaml
schedule: "0 6 * * *"
```

```bash
waddler serve pipeline.yml
```

That blocks and runs the pipeline on the cron schedule until you kill it. Drop it in a systemd service or a Docker container on a cheap VPS and it runs indefinitely. The implementation is `robfig/cron` for expression parsing and `select {}` to block the main goroutine, which is just the standard Go idiom for "keep running until killed."

Is cron syntax the right user-facing interface for scheduling though? Probably not for the audience I'm targeting. A non-technical user who wants "every Monday at 7am" has to figure out that's `0 7 * * 1`, which is not obvious and is easy to get wrong. Named presets like `schedule: daily` or `schedule: weekly` seem more usable, with full cron syntax still available for people who need it. Might add that in a follow-up; it's a small change on the implementation side.

---

## Where it stands

Waddler is [up on GitHub](https://github.com/mehrabr/waddler) under MIT. Install it with:

```bash
CGO_ENABLED=1 go install github.com/mehrabr/waddler/cmd/waddler@latest
```

Source types right now: CSV, JSON, Parquet, Postgres, MotherDuck. Output types: Parquet, CSV, MotherDuck with append or replace mode. The `examples/` directory has working pipelines for donor reporting, Postgres-to-Parquet migration, and scheduled sync.

Things I'm still genuinely unsettled on: inline SQL vs file references for complex transforms, plugin-style source registration vs the current switch statement, hard validation failure vs warn-only mode, whether natural-language scheduling presets are worth adding, and pre-built CGO binaries. If you've thought about any of these or have opinions from building something similar, I'd really like to hear it.

The broader question I started with, how much of the complexity in enterprise data engineering is actually necessary, I think waddler is a small piece of evidence that the answer is "less than we act like it is." Whether waddler is the right abstraction on top of DuckDB, or whether there are better ones, I'm not sure. But small projects have a way of teaching you more than you expect, and this one already has.
