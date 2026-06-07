---
layout: post
title: "your students' motivation is your problem"
date: 2026-06-07 09:00:00 -0700
categories: [Teaching]
tags: [teaching, bootcamp, training, motivation, curriculum, management]
---

First year, I gave a cohort a full week with no assignments — build whatever you want. By Wednesday the room looked like a waiting room.

Students recognize it when I describe it. Most have sat in one.

I spent a long time thinking that was a them problem. It took a few cohorts to figure out it was mine.

---

I.

Three conditions produce durable motivation. Not excitement — excitement is weather. Autonomy, cohesion, and competence. All three are necessary.

A student with high competence and no cohesion grinds in isolation until they stop. A student with strong cohesion and no competence coasts on goodwill without growing. A student with autonomy and competence but no cohesion starts treating class like a job they're overqualified for.

Disengagement doesn't look like absence. It looks like someone typing, still in the room, mentally somewhere else.

---

II.

The waiting room I built in week one was an autonomy failure, but not because I gave them too much structure. Because I gave them none and called it freedom.

Autonomy isn't freedom. This distinction wrecked me when I finally understood it. Autonomy is something to push against. You can't feel agency in a void. Freedom is an empty room with no exits.

What I'd given students was infinite options and called it choice. "Build whatever you want" sounds generous until you realize that generating constraints from scratch is a separate skill, a hard one, and I hadn't taught it. They were stuck because a choice needs something to push against. There was nothing.

What actually worked was a constrained brief with fixed quality requirements and open feature scope. Something like: this API exists, it doesn't do X, build a CLI that does. Test coverage above 80%, automated pipeline, interactive and non-interactive modes — fixed. What the tool does, what data it manages, who the imagined user is — theirs. The quality bar gave their choices weight; the open feature scope gave them something to own. Neither alone would have done it.

The constraint was the gift. It just didn't look like one.

---

III.

Cohesion gets almost no attention in curriculum design because it looks social rather than instructional. That's a category error. A rubric can grade a deliverable. Cohesion isn't a deliverable. So it doesn't get designed, even by instructors who believe it matters.

A student whose commits block three other people is in a different psychological situation from one working alone. The one with teammates doesn't slack off on the PR when others are waiting for it. The stakes are real. Simulation doesn't produce real stakes. You can tell students to "act like it's a real company" and it doesn't work. Real stakes come from real dependencies: a commit that breaks someone else's work, a review someone responds to, an issue that someone else closes.

I ran cohorts like small engineering organizations. GitHub organizations with teams, pull request reviews done in front of the group, async updates. Not to simulate professionalism. To create the structures where cohesion could exist.

The students who formed what I started thinking of as specialization nodes — the one who went deep on testing, the one who cared about the CLI experience, the one who got into database design — had the highest cohesion in the room. They had something to offer that nobody else had. Other students sought them out. You can't produce that directly. You produce the conditions and let it form. Or you don't, and you wonder why everyone feels interchangeable.

---

IV.

Douglas McGregor's Theory X says workers dislike work and have to be controlled and measured. Theory Y says they'll self-direct if the conditions exist.

Autonomy + Cohesion + Competence = Volition. That's Theory Y as a design requirement, not a belief.

Most bootcamp instructors believe Theory Y. Their curricula are Theory X. The proof isn't in beliefs. It's in what the structure rewards.

What gets incentivized: submitting things on time, producing the right output. What happens when a student struggles: scaffolding until they produce the deliverable. The deliverable is always the point. That's Theory X with a friendly tone.

And it produces students who follow instructions well and freeze without them. Which is the situation waiting for them on day one of a job, where the backlog is full of vague tickets and the senior dev is in a meeting.

When you evaluate students individually on artifacts, you get students who optimize for artifacts. They copy when stuck rather than ask, because asking reveals a gap and the gap affects the grade. They avoid hard problems because hard problems look bad before they look good. These are rational decisions. That's the problem.

What I tried instead: measure throughput of work, evaluate the team rather than the individual, make the shared artifact the unit of accountability. If the team shipped the feature, they did well. If a PR broke the build, the team fixed it together. This is harder to grade. It produces developers who can work with other people.

---

Most of what gets called a motivation problem in technical education is a design problem. The student didn't fail to bring motivation. The environment failed to build conditions for it.

The students didn't build that room. I built it and called it freedom.
