---
layout: post
title: "rules of thumb"
date: 2026-06-19 09:00:00 -0700
categories: [Teaching]
tags: [teaching, bootcamp, training, patterns, llm]
---

Common problem in the early days of Revature. A year out of training, most trainees were still junior. Passing code review, shipping features, fixing the same kinds of problems since their starting date. A few crossed to senior. Most didn't.

I finally looked at how we were teaching. Or how we weren't.

---

I.

Every bootcamp assessment grades a deliverable. The capacity that produced it is invisible to the rubric. You can pass every assignment in a twelve-week bootcamp by knowing enough patterns. Many students did.

LeetCode tests recall of specific algorithmic patterns — sliding windows, two-pointer traversals — most of which developers encounter once in an interview and never again. But a broken build in CI, a Hibernate `LazyInitializationException`, a dependency that shadows another one in the fat jar? The interview and the job are testing different things. The bootcamp prepares students for the interview.

The cohorts that plateaued had satisfied every assessment, cleared every mock interview. They had the patterns, and nothing to make sense of them.

---

II.

Before structural theory, builders built things. Great things. Medieval monumental mosques and cathedrals and palaces. The builders worked from pattern books: arch proportions, wall thickness per story height, span-to-depth ratios. Rules of thumb passed through guilds. Nobody knew why the proportions worked. The theories came three hundred years later.

Programming is in this state. The practice precedes the theory by decades. We have pattern books everywhere — Stack Overflow, GitHub, framework documentation. Rules of thumb: don't repeat yourself, single responsibility, stateless services. They often work. We often can't say why.

Medicine licenses against established clinical practice. Engineering certification tests against structural theory. Programming borrowed the certification model before it had a theory to certify against. The credential tests whether you've memorized the right patterns because that's all it can test. Bring your own reasoning capacity.

"But programming has theory. That's what computer science is."

Computer science has theory. What most developers do isn't computer science.

The curriculum I was teaching was a pattern book. I was teaching the proportions of the arch.

---

III.

I pulled the deliverable assignments out and put ambiguous problems in.

Some students froze. They'd been optimizing for rubrics and there was nothing to satisfy. Others opened a terminal and started narrowing. The ones who flourished had broken something earlier and had to fix it.

The Linux week was this. Students got a bare machine — or WSL on Windows — with one task: build a development environment. No spec. The JDK, git, a package manager, a database, setup scripts to reproduce the state. Done when you could explain every tool and why it was there.

Four terminal windows:

```
# window 1 — build and run
mvn compile && mvn exec:java -Dexec.mainClass=App

# window 2 — version control
git status && git diff

# window 3 — scratch
jshell
```

The assessment wasn't what, it was the why. Those who could answer that earned their IDE, no longer a crutch but a proper tool. Without it, they still had their terminals.

There's a Java HTTP server in my teaching repo: fifteen percent of the Servlet spec, no filters, no session management, just a dispatch loop. Parse the path, call the handler, write the response. Once you've written it, `@WebServlet` becomes shorthand for something you've already done. Without it, you could still write your own.

---

IV.

The developers who crossed to senior knew patterns, but they'd broken the jank version enough times to know why the patterns existed.

The capacity isn't knowing more things. It's knowing which question to ask when something breaks. A classpath error means the JVM can't find a class. A JAR isn't where it's expected. Either the build failed or the dependency isn't declared. That chain of reasoning is a model of the system. You don't get it from a pattern book.

The students who developed it never avoided breaking things. They broke things regularly and could explain why.

---

LLMs are very good at patterns, and developers were already shipping code using patterns they didn't understand. What LLMs produce is pattern-correct code: right shape, right annotations, and it inherits every assumption the pattern made. If the pattern assumed a single datasource, the generated code assumes one. If the pattern ignored the transaction boundary, so does the output.

The developer who knows why the arch holds can read the output and catch when it's wrong. The one who didn't, won't. Their wheels spin faster, but they still go nowhere.

The model and the students learned the pattern, but the model student learned why.
