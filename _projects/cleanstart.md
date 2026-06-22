---
title: cleanstart
slug: cleanstart
order: 3
featured: true
status: shipped
pitch: >-
  An MCP server that runs agent code inside zero-CVE hardened containers,
  plus two browser demos of the container-security value prop.
tech: [Node.js, MCP, Docker, CleanStart]
repo: https://github.com/mehrabr/cleanstart-mcp
demo_url: https://mehrabr.github.io/cleanstart/
demo_local: /cleanstart/analyzer/
---

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

Also: two browser-based tools built to demonstrate CleanStart's container security value
proposition interactively — a gap that exists in both CleanStart's and Chainguard's
public tooling.

**[Container Security Analyzer](/cleanstart/analyzer/)** — enter any public Docker image name, get a simulated
CVE breakdown by severity, side-by-side size comparison with the CleanStart equivalent,
an SBOM component view with signing status, and the one-line Dockerfile change required.
The before/after that runs itself in a customer PoC.

**[Sandbox Security Dashboard](/cleanstart/sandbox/)** — simulates the real-time monitoring layer I built for
containerized training environments: 24 student containers across multiple cohorts, a
live boundary event log showing escape attempts blocked by seccomp profiles,
per-container CVE drill-down, and the CleanStart remediation for each. Built from direct
operational experience running this infrastructure at Revature.
