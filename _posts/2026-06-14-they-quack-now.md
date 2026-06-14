---
layout: post
title: "they quack now? they quack now"
date: 2026-06-14 09:00:00 -0700
categories: [Projects, Data Engineering]
tags: [go, duckdb, quack, networking, waddler]
---

The relay I wrote up two weeks ago didn't work.

I ended that post announcing `waddler relay`: a hub mode, a local server, remote instances pushing their pipeline results into one shared DuckDB. I had the subcommand, a server process, and a client that posted to it. The two of them never actually talked. They held a port open and disagreed about everything that crossed it.

---

## I

The relay was mine. I'd written the networking by hand. A small HTTP server took a body of rows and wrote them into a file-backed DuckDB; a client serialized a pipeline's output and sent it across. I did that on purpose. Quack was new and I wanted to know what it solved before I leaned on it, and the way I learn that is to build the naive version and find where it hurts.

It hurt where these things always hurt. Two DuckDB instances have a lot to agree on — column types, how a write turns into an `INSERT` on the far side, what a row even looks like on the wire — and I was re-deciding all of it, in a format only my client and my server understood. Every fix on one end was a matching fix on the other.

---

## II

"You could have just finished your protocol." I could have. DuckDB had already finished a better one.

I knew that going in; finishing my own was never the point. Quack is a real client-server protocol with framing, auth, and a wire format that two DuckDB instances already agree on, shipped inside the engine I was linking against. I was hand-maintaining a worse copy of it. The naive relay had already done its one useful job — it showed me what the protocol has to carry — and the moment it had, keeping it was just stubbornness.

So I deleted it. The `relay` package, the hand-rolled server, the serialization, all of it.

---

## III

What replaced it is DuckDB's. The `quack` output attaches the hub and writes to it:

```go
attachSQL := fmt.Sprintf("ATTACH %s AS %s (TYPE quack, TOKEN %s)",
    sqlutil.QuoteLiteral(out.URL), sqlutil.QuoteIdent(alias), sqlutil.QuoteLiteral(token))
// then: CREATE OR REPLACE TABLE <hub>.main.<table> AS <result>
//   or: INSERT INTO <hub>.main.<table> BY NAME SELECT ... for append
```

The hub serves a file over `quack_serve`:

```go
call := fmt.Sprintf(
    "CALL quack_serve(%s, allow_other_hostname => true, token := %s)",
    sqlutil.QuoteLiteral(addr), sqlutil.QuoteLiteral(token))
```

`relay` became `hub`. My code now generates two SQL statements and gets out of the way.

---

## IV

It compiled clean, then fell over the first time it ran, and the reason was dumber than the protocol.

Native Quack needs DuckDB 1.5.3 or newer. The go-duckdb driver I'd been building on statically links one specific DuckDB version, and the one it embedded didn't have Quack at all. `ATTACH ... (TYPE quack)` is a clean line of SQL the engine underneath had never heard of.

Getting a newer engine meant moving to the v2 line of the driver and pinning it to the latest release:

```bash
go get github.com/marcboeker/go-duckdb/v2@latest
go mod tidy
```

That reads like one line and was not. v2 is a different module path, which makes the bump a full swap: every import of the old path has to move, cgo has to find and statically link the newer DuckDB, and `go.sum` only regenerates somewhere a C compiler and the network are both present. The first time I thought I'd done it, the build still linked the old engine off one stale `v1` import I'd missed, and `version()` came back on the wrong side of 1.5.3. I lost more time chasing that than on the entire refactor above it.

The hub checks the engine before it tries anything:

```go
if err := eng.RequireDuckDB(1, 5, 3); err != nil {
    return fmt.Errorf("hub: %w", err)
}
```

A too-old build now fails on startup with the exact `go get` line that fixes it, instead of an obscure Quack error three calls deep.

---

## V

The experiment failed, and that was fine. I'd built the relay to feel the problem myself, and by the time it stopped working it had already shown me what Quack has to carry. Finishing with DuckDB's own protocol was the obvious way to close the loose end, so that's what I shipped.

The version was the part I hadn't budgeted for. I knew Quack had just landed. The DuckDB welded into my driver, though, predated the release that carried it, so the feature sat in the project the whole time, one pinned version out of reach. A dependency is the upstream frozen on a date, and mine was running last season's DuckDB.
