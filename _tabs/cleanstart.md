---
layout: page
title: CleanStart
icon: fas fa-shield-halved
order: 3
---

Container security tooling and demos built around CleanStart hardened images — distroless containers with zero CVEs.

---

## Browser Demos

**[Container Security Analyzer](/cleanstart/analyzer/)** — Enter any public Docker image and see a CVE scan: critical/high/medium breakdown, side-by-side size comparison with the CleanStart equivalent, SBOM component list, and the one-line Dockerfile fix.

**[Sandbox Security Dashboard](/cleanstart/sandbox/)** — Simulates the real-time security monitoring layer I built for containerized training environments at Revature. 24 student containers, live boundary event log, per-container CVE drill-down, and the CleanStart remediation for each.

---

## MCP Server

**[cleanstart-mcp](https://github.com/mehrabr/cleanstart-mcp)** — A Model Context Protocol server that runs AI agent code inside CleanStart hardened containers instead of public base images. Every existing MCP sandbox defaults to `python:3.11`, `node:20`, etc. This one defaults to `cleanstart/*`. Zero CVEs in the sandbox itself.
