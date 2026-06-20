---
layout: post
title: "do we actually need the classroom"
date: 2026-06-15 09:00:00 -0700
categories: [Teaching]
tags: [teaching, ai, training, curriculum, waddler]
---

My employer trained junior engineers in cohorts and placed them with clients on contract. This year the clients wanted fewer of them, because the junior work had started going to AI. The business shrank, and I had time to look at a habit I'd never examined.

When a piece of infrastructure exists to serve a metric, I want to know whether anyone ever checked the metric. The infrastructure is usually good at its job. Whether its job is the one anyone wanted is the separate question, and it stays unasked, because asking it suggests the infrastructure might not need to exist.

---

I.

The cleanest version I'd run was on a Spark cluster. It was processing a pipeline that fit on a laptop. I wrote a replacement to find out how much I'd miss it: [waddler](https://github.com/mehrabr/waddler), a Go binary that runs the same ETL out of a YAML file with DuckDB underneath, no cluster, no orchestration.

The cluster was there to handle scale, and by the throughput numbers it handled it well. Nobody had checked whether we had the scale. We didn't. The strange part of removing infrastructure that isn't carrying load is that nothing breaks. The system keeps running, and the only thing gone is the work you'd been doing to keep the cluster fed.

You maintain one of these. Something built for a load you don't carry, that you keep anyway, because pulling it out would mean explaining why it was ever there.

---

II.

The training ran on the same logic, except the infrastructure had people in it. Lecture-forward, full-time, nine to five in front of a room. The metric was contact hours: instruction delivered, counted by the time spent delivering it. By that measure the program was a success. It produced a great many hours.

I didn't believe contact hours were what turned a person into an engineer you could hand a ticket, so I changed the shape of the program. Twenty percent lecture, eighty percent the students working as juniors on a team with real tasks. I ran it as a workshop, the way a trade gets learned by doing it: the work and the training were the same thing, and you got better by doing the next piece next to someone who already could. Plans changed daily, and I kept it loose deliberately; people take on harder problems when they aren't afraid of them.

When someone got stuck I'd run the session as a mob with the roles reversed. They drove; I sat at the keyboard and typed whatever they argued their way into. Nobody froze at a red error or stalled trying to recall the order of arguments, because the keyboard wasn't theirs to fear. What was left, once that friction was gone, was the part the lecture never reached. They reasoned out loud, and understood more than the typing had been letting them show.

"But they have to type it themselves to learn." They did, later, on their own. Typing was never the part they couldn't do.

---

III.

That metric was the cohort itself. Not whether it was taught well, but whether a trained cohort was the thing the client needed. I never reached that question. I was inside the classroom, improving how it ran, and from inside a classroom you don't get to ask whether it should exist at all.

The clients asked it. Once the junior work could be done with a tool they needed fewer juniors, and a cohort is how you train them. The question I'd been applying to the classroom by hand, one piece at a time, was being asked of the whole classroom at once, from outside, by people holding a tool built to ask it faster than I ever could.

It is the same question at two scales. I ran it from the inside, carefully, one cluster at a time. The clients ran it on the entire system in a quarter. I was standing on the layer it reached.

---

IV.

I took the keyboard from those students on purpose, and what came up wasn't less of them. It was more. The fear at the keyboard had been sitting on people who could already think.

The cold reading is that I was a removable cost. It's true. It's also not the thing I watched happen in that room more than once: when the infrastructure comes off a person, what's underneath is more than it was letting show.

I don't know yet which one this year will be. But I've run the small version too many times to believe removal is only subtraction. The cluster came off the laptop and the work ran faster. When I stopped typing for the students, the thinking in the room got louder. I'm standing on a layer that's about to come off, and I'm betting, the way I bet on those students, that there's more underneath than the job was letting show.
