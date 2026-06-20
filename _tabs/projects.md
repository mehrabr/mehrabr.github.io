---
layout: page
title: Projects
icon: fas fa-code
order: 2
---

A running list of things I've built or am building, mostly small, mostly in public.

---

## holdout

A Python tool that asks several LLMs to reason through a question independently, each
committing a written rationale and a yes/no vote before seeing any of the others. It
keeps every rationale — including the losing one — as a durable record, and when the
models disagree it returns the specific point of disagreement rather than forcing an
answer. No synthesis step, no merged "best" response, no accuracy claim.

Most multi-model tools dissolve disagreement into one answer. holdout preserves it,
on the bet that for decisions with no verifiable answer, the reasoning that didn't win
is exactly what's worth keeping for the postmortem.

Built for the decisions that don't have a right answer: should we rewrite this service,
is this trade-off acceptable, do we ship. The kind where "it depends" is the honest
answer and the dissent is the point.

[github.com/mehrabr/holdout](https://github.com/mehrabr/holdout) &nbsp;·&nbsp; Python, LLMs

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

---

## marchland

A historical battle and campaign simulation where you command armies across career seasons —
muster, march, siege, battle, winter court. Every outcome replays identically from the same seed.
Every death has a cause you can read.

Built around one thesis: history is hard to predict and easy to explain. Three design decisions
follow from it. First, no quality coefficients — every difference between forces must have a
receipt, a changeable in-world fact (drill-days, calories, armor, roads, bonds) that an automated
audit checks against every data file. Second, a full trace: time, killer, cause (melee · volley ·
pursuit · thirst · disease), location — every rout records the appraisal cues that triggered it.
Third, you command; you don't pilot. Orders travel at rider speed. Men appraise them against what
they can see. You can't undo a dispatch once sent, and your patron evaluates based on what you
reported, not what actually happened.

[github.com/mehrabr/marchland](https://github.com/mehrabr/marchland) &nbsp;·&nbsp; Python, numpy

---

## agentic-duckdb-analyst

A natural-language-to-SQL agent over DuckDB that doesn't trust its own first answer.

Most text-to-SQL systems execute a query and return the result. This one runs the result through
a four-tier verification ladder before surfacing it: an execution guard that catches parse and type
errors for free, a result sanity check that detects empty or degenerate outputs, an intent
alignment step that back-translates the SQL to verify it answers the right question, and a
self-consistency check that samples independent responses and measures agreement. The system
also distinguishes between answerable questions, unanswerable ones it should decline, and
ambiguous prompts with multiple valid interpretations — and is evaluated on all three.

Ships with a 64-question gold eval set and reports results honestly, including known weaknesses
in order-sensitive comparison and schema retrieval.

[github.com/mehrabr/agentic-duckdb-analyst](https://github.com/mehrabr/agentic-duckdb-analyst) &nbsp;·&nbsp; Python, DuckDB, Claude

---

## cleanstart-demos

A Model Context Protocol server that executes AI agent code inside CleanStart hardened
container images instead of public base images. When an LLM calls a code execution tool,
the sandbox it runs in is typically built on `python:3.11` or `node:20` — images carrying
150–200+ known CVEs. This server defaults to `cleanstart/python`, `cleanstart/node`, and
`cleanstart/go` instead. Zero CVEs in the sandbox itself.

Exposes five MCP tools: `run_code`, `run_file`, `list_images`, `compare_images`, and
`scan_image`. Security defaults applied automatically on every execution: all Linux
capabilities dropped, non-root user, read-only filesystem, network disabled, memory and
PID limits. No existing MCP sandbox uses CleanStart images — this fills that gap in the
agentic AI supply chain.

Also:

Two browser-based tools built to demonstrate CleanStart's container security value
proposition interactively — a gap that exists in both CleanStart's and Chainguard's
public tooling.

**Container Security Analyzer** — enter any public Docker image name, get a simulated
CVE breakdown by severity, side-by-side size comparison with the CleanStart equivalent,
an SBOM component view with signing status, and the one-line Dockerfile change required.
The before/after that runs itself in a customer PoC.

**Sandbox Security Dashboard** — simulates the real-time monitoring layer I built for
containerized training environments: 24 student containers across multiple cohorts, a
live boundary event log showing escape attempts blocked by seccomp profiles,
per-container CVE drill-down, and the CleanStart remediation for each. Built from direct
operational experience running this infrastructure at Revature.

[mehrabr.github.io/cleanstart/](https://mehrabr.github.io/cleanstart/)

[github.com/mehrabr/cleanstart-mcp](https://github.com/mehrabr/cleanstart-mcp) &nbsp;·&nbsp; Node.js, MCP SDK, Docker, CleanStart

