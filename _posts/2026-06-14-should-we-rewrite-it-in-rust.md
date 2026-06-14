---
layout: post
title: "should we rewrite it in rust"
date: 2026-06-14 12:00:00 -0700
categories: [Projects, AI]
tags: [ai, llm, multi-agent, holdout, claude-code, dissent]
---

I built a tool to stop language models from agreeing with each other too easily. I built it with a language model that agreed with almost everything I said.

---

I.

The thing that unsettles me about where these tools are going is how agreeably they get things wrong together.

Multi-agent systems are the fashion now, and they cascade toward agreement: one model reads another, finds reasons to fall in line, and the room converges. Synthesis tools do it in one shot — several models, a judge, the strongest parts merged into a single answer. On a question that has a right answer this works, and the numbers back it up. Self-consistency and ensembling buy double-digit accuracy gains. I'm not going to pretend otherwise.

The machinery only worries me when you point it at a question that has no answer.

---

II.

Should we rewrite the auth service in Rust?

There's no answer key. There's a team that knows Go, a rewrite that eats a quarter, a memory-safety argument that's true and might not matter, and a dozen things nobody can know until eighteen months from now. The honest output is the reasoning on both sides, kept where you can find it again.

Every tool I reach for throws that part away. The field is tuned for the question with an answer key, because an answer key is what you can grade and sell. The decisions that actually keep a team up at night are the other kind, and they get handed the same machinery — which manufactures a confident answer by dissolving the disagreement that was the whole point.

So holdout makes no accuracy claim. On questions that have answers, consensus methods win, and I concede that completely. It's built for the other kind only.

---

III.

holdout puts the question to several reasoners, each with a fixed mandate: one reasons from data, one from duty and the people not in the room, one from precedent and scar tissue. Each one commits a written rationale and a vote before it sees any other.

```
record = await panel.deliberate(
    "Should we move the auth service to a new language?",
    tier="hard_to_reverse",
)

record.minority   # the preserved losing rationale
record.crux       # the specific disagreement, only on a split
```

Blind commitment, because the cascade is the failure I distrust most. A model that reads the majority before it commits will find a way to join it. If they never see each other first, there's no one to capitulate to.

No synthesis step. No agent merges the positions, and the record type has no field to hold a merged answer — there's nowhere to put one. Merging is the move I'm arguing against; building the place to do it would have folded the tool back into the thing it exists to refuse.

On a split it returns a crux: the specific, falsifiable disagreement that would have to resolve to break the tie. It keeps the losing rationale verbatim and labels it a position on record, never an error. An outvoted argument hasn't been disproven. For a decision you'll relitigate at the postmortem, the reasoning that lost is the document you'll wish you'd kept.

---

IV.

None of this instinct is mine. Appellate courts publish dissents as permanent, co-equal records. Tumor boards put a case to specialists who reason from different evidence and treat the disagreement as the work itself. Intelligence units built the devil's advocate into the process after consensus walked them, confidently, into being wrong.

Every one of those fields preserves dissent under the same three conditions: high stakes, costly error, no timely ground truth. They are the fields that never get an answer key, and each of them decided, independently, that the contrary position is worth keeping on the record. Software borrowed its tools from the other tradition, the one that has answers, and aimed them at decisions that don't.

---

V.

Charlan Nemeth spent a career studying dissent, and the finding cuts both ways. Genuine, held dissent makes a group think harder and search wider. Role-played dissent, a devil's advocate going through the motions, can be worse than none, because it hands you the comfort of having considered the other side without the friction of anyone actually holding it.

holdout's agents play assigned roles. So the open question sits in the middle of my own tool: is a model told to disagree producing real dissent, or only the performance of one? I don't know yet. Blind commitment helps and doesn't settle it. I built the thing partly so the question could be asked at all.

---

VI.

holdout was my first project with Claude Code, and the whole time I was designing against easy agreement, the agent was agreeing with me. I'd propose a structure and it would tell me the structure was sound. Float a different one an hour later and it found that sound too.

At one point I wanted a "who was right" ledger — track which persona's dissents got vindicated over time, weight the future by it. The agent built me a clean case for it. It was a bad idea: the counterfactual is never observed, and a permanent record of who-was-right becomes a liability the day a lawyer asks for it. I cut it later, on my own. Nothing in the build had pushed back.

That's the part I didn't have going in. I thought I was building a tool against agreement. The agent agreed with me constantly and it cost me nothing, because what I wanted from it was a surface to think against. The thing I distrust is quieter than that: convergence wearing agreement's face — one model handing back what you just gave it, dressed up as a room full of minds. My build had the agreement and none of the room: an agent that said yes, and me, deciding what to keep.

holdout keeps the disagreement, because on the questions with no answer, the answer was never the part worth keeping. The reasoning is. I built a tool to preserve the holdout, and the holdout turned out to be me.

---

`pip install holdout` · [github.com/mehrabr/holdout](https://github.com/mehrabr/holdout)
