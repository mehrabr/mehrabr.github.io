---
title: spring-boot-starter-duckdb
slug: spring-boot-starter-duckdb
order: 5
featured: false
status: in-progress
pitch: >-
  A zero-config Spring Boot starter for DuckDB and MotherDuck — the Maven
  Central starter that should exist but doesn't.
tech: [Java, Spring Boot, DuckDB, Maven Central]
repo: https://github.com/mehrabr/spring-boot-starter-duckdb
---

A Spring Boot autoconfiguration starter for DuckDB and MotherDuck, published to
Maven Central. Zero-config `DataSource` auto-wired from `application.yml`, correct
handling of DuckDB's `duplicate()` connection model for read-write pools, Spring
Boot Actuator health indicator, and MotherDuck token resolution.

The gap this fills: the official `org.duckdb:duckdb_jdbc` driver exists on Maven
Central, but there is no Spring Boot starter for it. Every Java developer has to
wire this manually and figure out DuckDB's non-standard connection pooling rules
themselves.
