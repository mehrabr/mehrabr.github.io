---
title: desi family tree
slug: desi-family-tree
order: 7
featured: false
status: shipped
pitch: >-
  Trace a relationship from "you" and see its name across two dozen South
  Asian languages, grouped by language family.
tech: [React, esbuild]
demo_local: /desi-family-tree/
---

A South Asian kinship decoder. Build a relationship step by step — mother's brother,
father's elder sister's husband — and see what that person is called across twenty-four
language columns spanning four families: Indo-Aryan, Dardic, Iranian and Dravidian.
Roman transliteration is the primary reference, with native script shown where reliable.

The interesting part is where the languages disagree. English collapses everything into
"uncle" and "cousin"; most South Asian languages don't — mother's brother and father's
brother get different words, and Dravidian in-law terms shift with the speaker's gender.
Bengali and Punjabi each appear as two co-equal columns (Bangladesh/West Bengal,
Pakistan/India) because the pairs genuinely diverge. Alongside the tracer there's a
patterns view explaining the structural splits between families, and a practice quiz.

A single React component compiled with esbuild into a static page — no backend, no
framework runtime beyond React itself.
