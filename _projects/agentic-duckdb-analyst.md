---
title: agentic-duckdb-analyst
slug: agentic-duckdb-analyst
order: 4
featured: false
status: shipped
pitch: >-
  A natural-language-to-SQL agent over DuckDB that doesn't trust its own first
  answer — it runs every result through a four-tier verification ladder first.
tech: [Python, DuckDB, Claude]
repo: https://github.com/mehrabr/agentic-duckdb-analyst
---

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
