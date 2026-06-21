---
layout: page
title: holdout
icon: fas fa-scale-balanced
order: 4
---

A Python tool that asks several LLMs to reason through a question independently — each committing a written rationale and a yes/no vote before seeing any of the others. No synthesis step, no merged "best" response. When models disagree, holdout returns the specific point of disagreement.

Built for decisions that don't have a right answer: should we rewrite this service, is this trade-off acceptable, do we ship. The kind where "it depends" is the honest answer and the dissent is the point.

---

## Interactive Demo

**[Deliberation Viewer](/holdout/holdout-deliberation.html)** — Watch three reasoners (Empiricist, Builder, Steward) work through a question in isolation. Rationales are sealed until reveal. Votes are tallied. When they split, the falsifiable crux surfaces — the one point that would actually change a mind.

---

## CLI Tool

```bash
pip install holdout
holdout "Should we rewrite the auth service or patch it?"
```

Source: [github.com/mehrabr/holdout](https://github.com/mehrabr/holdout)
