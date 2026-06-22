---
title: marchland
slug: marchland
order: 6
featured: false
status: shipped
pitch: >-
  A historical campaign simulation where every death has a cause you can read
  and every outcome replays identically from the same seed.
tech: [Python, numpy]
repo: https://github.com/mehrabr/marchland
---

A historical battle and campaign simulation where you command armies across career seasons —
muster, march, siege, battle, winter court. Every outcome replays identically from the same seed.
Every death has a cause you can read.

Built around one thesis: history is hard to predict and easy to explain. Three design decisions
follow from it. First, no quality coefficients — every difference between forces must have a
receipt, a changeable in-world fact (drill-days, calories, armor, roads, bonds) that an automated
audit checks against every data file. Second, a full trace: time, killer, cause (melee · volley ·
pursuit · thirst · disease), location — every rout records the appraisal cues that triggered it.
Third, you command; you don't pilot. Orders travel at rider speed. Men appraise them against what
they can see. You can't undo a dispatch once sent, and your patron evaluates based on what you
reported, not what actually happened.
