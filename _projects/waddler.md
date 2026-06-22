---
title: waddler
slug: waddler
order: 2
featured: true
status: shipped
pitch: >-
  A Go binary that runs a complete DuckDB ETL pipeline from a YAML file.
  No Python env, no Spark cluster, no Airflow.
tech: [Go, DuckDB, MotherDuck]
repo: https://github.com/mehrabr/waddler
---

A Go binary that reads a YAML pipeline file and runs a complete ETL pipeline using
DuckDB as the query engine. No Python environment, no Spark cluster, no Airflow.
Describe your sources, write your SQL, declare your output. Run `waddler run pipeline.yml`.

Supports CSV, JSON, Parquet, Postgres, and MotherDuck as sources. Writes Parquet,
CSV, or directly to MotherDuck. Built-in validation rules and cron scheduling.

Built for organizations that have real data needs but not the resources for enterprise
tooling: food banks, non-profits, small teams.
