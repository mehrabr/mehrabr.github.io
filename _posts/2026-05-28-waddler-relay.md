---
layout: post
title: "waddler multiplayer, or, what to do with two talking ducks?"
date: 2026-05-28 09:00:00 -0700
categories: [Projects, Data Engineering]
tags: [go, duckdb, quack, etl, waddler]
---

DuckDB released a blog post a couple weeks ago about something called the Quack protocol, a lightweight client-server protocol that lets DuckDB instances talk to each other over HTTP. Waddler, which already uses DuckDB as its query engine and already has MotherDuck as a cloud output type, was built without this feature in mind so I took some time to think on what this means for my project. The obvious move is just adding a `quack` output type alongside `motherduck`. But I kept thinking there was something more interesting to do with it, and I wanted to write up how I got there. Plus, my first experience with Go many years ago was for network engineering, so this was a nice surprise returning to an old problem space.

---

## What Quack actually is

You can start a DuckDB server with `CALL quack_serve(port := 9494)`, and then connect to it from another DuckDB instance with `ATTACH 'quack:myserver:9494' AS remote`. After that you can `CREATE TABLE remote.mytable AS (SELECT ...)` and it works. Authentication uses a token you set at startup. The protocol is HTTP under the hood, single round trip per query.

But what to build with it: it's not yet recommended for direct internet exposure without SSL termination in front, it binds to localhost by default, and the token is the only auth primitive in v1.

---

## The obvious move and why I wanted to do something else

Adding `type: quack` as an output to waddler is straightforward. The MotherDuck loader already does `ATTACH 'md:database' AS remote` and then writes to it; Quack is the same pattern with a different URL scheme. I could have shipped that in an afternoon.

But I kept thinking about the use case. Waddler already targets small orgs that can't afford enterprise data tooling. MotherDuck is the right answer for those orgs when they want cloud storage and don't want to manage infrastructure. But what about orgs that have a VPS, or a local server, or a single machine in the back room, and want shared data without a cloud account? That's a real category of org that waddler currently can't serve well.

Quack makes it possible to build something for that category. Not by pointing one waddler at a remote DuckDB file, but by letting multiple waddler instances, running on different machines, all push their results into a shared DuckDB file on a central server. The use case I kept coming back to: a regional organization with several branch offices, each running waddler on whatever laptop is available, pushing their weekly data to a hub where a coordinator can query everything together.

---

## waddler relay

The result is `waddler relay`, a new subcommand that starts waddler in hub mode. It runs a local Quack server backed by a persistent DuckDB file and accepts pipeline writes from remote waddler instances.

```bash
waddler relay \
  --db ./hub.duckdb \
  --port 9494 \
  --token-file ./relay.token \
  --allowed-pipelines donor_report,weekly_sync
```

On first start it generates a random token and writes it to `--token-file`. You hand that token to each branch office as an environment variable. Their pipelines use a `quack` output type pointing at the hub:

```yaml
output:
  type: quack
  url: quack:hub.example.com:9494
  token: ${RELAY_TOKEN}
  table: donor_report
  mode: replace
```

The coordinator on the hub machine can then query `hub.duckdb` directly with the DuckDB CLI and see all the branch data in one place. No cloud account, no managed service, just a $5/month VPS and a couple of config files.

---

## The part I spent the most time on: safety

Quack's auth model is a single token. That's fine for its intended use case, but it means the attack surface for something like the relay is worth thinking about carefully.

The `--allowed-pipelines` flag is the main mitigation. Without it, any client with the token can write any pipeline to the hub. That's probably fine for a two-person team on a trusted network, but for anything else it's too permissive. The relay starts if you omit the flag, but it logs a warning at startup so you know what you're not getting.

The row limit default is 10 million, configurable with `--max-rows`. This isn't really a security feature so much as protection against a misconfigured client accidentally filling the hub's disk. Rejected runs get logged server-side with a reason so you can see what happened.

The config validator also rejects a bare literal token in the YAML. If someone writes `token: abc123def` instead of `token: ${RELAY_TOKEN}`, they get an error explaining that tokens need to come from environment variables. This is the kind of thing that's easy to miss when you're setting something up quickly and embarrassing to discover later when you realize the token was in your git history.

For SSL I documented a minimal nginx config in the README. Quack itself says not to expose it directly to the internet without TLS termination, which is fair. The nginx setup is a few lines and certbot handles the certificate.

---

## A question I'm still thinking about

The allowlist is pipeline-name based, which is simple but maybe too simple. A client with the token and a pipeline named `donor_report` can write any SQL they want as the transform for that pipeline. For a trusted internal network that's probably fine. For anything where the clients aren't fully trusted, you'd want something more like a schema validator or at least a row count sanity check on the server side beyond the max-rows limit.

I'm not sure if that's v2 material or if it's scope creep for something that's supposed to stay simple. The whole point of waddler is that it's small enough to understand. The relay is already the most complex thing in the codebase by some margin. Adding server-side transform validation would make it noticeably more involved. Not sure yet.

---

## What's in the repo

Waddler is at [github.com/mehrabr/waddler](https://github.com/mehrabr/waddler). The relay is in `internal/relay/`, the quack source and output types are in `internal/source/` and `internal/loader/` respectively, and `examples/relay_hub.yml` and `examples/relay_client.yml` show the full setup with notes. The README has the nginx config.

The quack extension installs itself on first use via `INSTALL quack; LOAD quack;` inside the engine, so there's no new Go dependency. The only new external thing is `nginx` if you're putting this on the internet, which you'd have for any web-facing service anyway.

Install:

```bash
CGO_ENABLED=1 go install github.com/mehrabr/waddler/cmd/waddler@latest
```

If you try it out and hit something unexpected I'd genuinely like to know. The relay especially is new enough that I'd expect edge cases I haven't seen yet.
