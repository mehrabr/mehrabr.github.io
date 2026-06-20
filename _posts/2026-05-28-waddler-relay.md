---
layout: post
title: "waddler multiplayer, or, what to do with two talking ducks?"
date: 2026-05-28 09:00:00 -0700
categories: [Projects, Data Engineering]
tags: [go, duckdb, quack, etl, waddler]
---

Adding a `quack` output type to waddler is the obvious move. The MotherDuck loader already does `ATTACH 'md:database' AS remote` and writes to it; Quack is the same pattern with a different URL scheme. I could have shipped it in an afternoon.

DuckDB's Quack protocol lets instances talk over HTTP: `CALL quack_serve(port := 9494)` starts a server, `ATTACH 'quack:myserver:9494' AS remote` connects to it. Authentication is a token set at startup; the protocol is a single round trip per query. Waddler already targets small orgs that can't afford enterprise data tooling. MotherDuck is the right answer when those orgs want cloud storage. Quack opens a different case: orgs with a VPS, a local server, or a machine in the back room — shared data without a cloud account.

---

I.

The use case: a regional organization with several branch offices, each running waddler on whatever laptop is available, pushing their weekly data to a hub where a coordinator can query everything together.

`waddler relay` is the new subcommand. It runs waddler in hub mode: a local Quack server backed by a persistent DuckDB file.

```bash
waddler relay \
  --db ./hub.duckdb \
  --port 9494 \
  --token-file ./relay.token \
  --allowed-pipelines donor_report,weekly_sync
```

On first start it generates a random token and writes it to `--token-file`. Hand that token to each branch as an environment variable. Their pipelines use a `quack` output type pointing at the hub:

```yaml
output:
  type: quack
  url: quack:hub.example.com:9494
  token: ${RELAY_TOKEN}
  table: donor_report
  mode: replace
```

The coordinator queries `hub.duckdb` directly with the DuckDB CLI and sees all branch data in one place.

---

II.

Quack's auth model is a single token, which is fine for its intended use but worth thinking through on a relay.

`--allowed-pipelines` is the main mitigation. Without it, any client with the token can write any pipeline to the hub — acceptable for a two-person team on a trusted network, too permissive for anything else. Omitting the flag starts the relay but logs a warning at startup.

The row limit defaults to 10 million, configurable with `--max-rows`. This is protection against a misconfigured client filling the hub's disk. Rejected runs get logged with a reason.

The config validator rejects a literal token in the YAML. `token: abc123def` gets an error explaining that tokens need to come from environment variables — the kind of thing that's easy to miss when setting up quickly and embarrassing when you realize the token was in your git history.

SSL is documented as a minimal nginx config in the README. Quack says not to expose it directly to the internet without TLS termination; certbot handles the certificate in a few lines.

The allowlist is pipeline-name based, which means a trusted client can write any transform for that pipeline. Server-side transform validation would close this, at the cost of making the relay noticeably more complex. The whole point of waddler is that it stays small enough to understand.

---

Waddler is at [github.com/mehrabr/waddler](https://github.com/mehrabr/waddler). The relay is in `internal/relay/`, the quack source and output types in `internal/source/` and `internal/loader/`. `examples/relay_hub.yml` and `examples/relay_client.yml` show the full setup. The quack extension installs itself on first use — no new Go dependency.

```bash
CGO_ENABLED=1 go install github.com/mehrabr/waddler/cmd/waddler@latest
```

No cloud account, no managed service. A $5/month VPS, a token, and a couple of config files.
