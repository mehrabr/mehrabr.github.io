---
title: holdout
slug: holdout
order: 1
featured: true
status: shipped
pitch: >-
  Asks several LLMs to reason independently, seals each rationale before
  reveal, and preserves the disagreement instead of dissolving it.
tech: [Python, LLMs]
repo: https://github.com/mehrabr/holdout
demo_url: https://mehrabr.github.io/holdout/
demo_local: /holdout/holdout-deliberation.html
---

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
