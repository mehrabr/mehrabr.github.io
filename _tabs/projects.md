---
layout: page
title: Projects
icon: fas fa-code
order: 2
---

A running list of things I've built or am building, mostly small, mostly in public.

---

## waddler

A Go binary that reads a YAML pipeline file and runs a complete ETL pipeline using
DuckDB as the query engine. No Python environment, no Spark cluster, no Airflow.
Describe your sources, write your SQL, declare your output. Run `waddler run pipeline.yml`.

Supports CSV, JSON, Parquet, Postgres, and MotherDuck as sources. Writes Parquet,
CSV, or directly to MotherDuck. Built-in validation rules and cron scheduling.

Built for organizations that have real data needs but not the resources for enterprise
tooling: food banks, non-profits, small teams.

[github.com/mehrabr/waddler](https://github.com/mehrabr/waddler) &nbsp;·&nbsp; Go, DuckDB, MotherDuck

---

## spring-boot-starter-duckdb

*In progress.*

A Spring Boot autoconfiguration starter for DuckDB and MotherDuck, published to
Maven Central. Zero-config `DataSource` auto-wired from `application.yml`, correct
handling of DuckDB's `duplicate()` connection model for read-write pools, Spring
Boot Actuator health indicator, and MotherDuck token resolution.

The gap this fills: the official `org.duckdb:duckdb_jdbc` driver exists on Maven
Central, but there is no Spring Boot starter for it. Every Java developer has to
wire this manually and figure out DuckDB's non-standard connection pooling rules
themselves.

[github.com/mehrabr/spring-boot-starter-duckdb](https://github.com/mehrabr/spring-boot-starter-duckdb) &nbsp;·&nbsp; Java, Spring Boot, DuckDB, Maven Central
