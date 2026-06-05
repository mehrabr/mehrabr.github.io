---
layout: post
title: "install day was the curriculum"
date: 2026-06-05 09:00:00 -0700
categories: [Teaching]
tags: [teaching, bootcamp, training, curriculum, environment, linux]
---

Revature issued no machines. Thirty students, first day, bring whatever you have.

The first morning was Java. Not teaching it. Installing it.

Every bootcamp has a version of this day.

---

I.

Three Windows 10s, two Windows 11s, one Windows 7, four Macs, a Chromebook someone was hoping to make work, and one student running Arch Linux who was visibly bored. Oracle Express took forty-five minutes per machine. By lunch we had maybe twenty working setups and ten students who'd spent the morning watching their neighbors.

I spent the next few years trying to make this problem go away.

USB images for VirtualBox: students boot into a clean environment and go home to Windows every night. Docker containers: nothing to install, nothing to understand — when something breaks, nobody knows where to look. Cloud VMs with SSH through Chromebooks: twelve weeks working in a house they don't own. Chocolatey and Homebrew: at least the invisibility was faster.

Every solution was a different way to make the environment invisible. Every one was trying to answer the same question: how do I get past this and start the real learning?

The Docker cohort made it clear. Students had a running environment on day one. By week three they couldn't explain where their compiled class files went or why the JVM was on their PATH. The ones who'd fought through install day knew. They'd broken those things and fixed them.

That question was wrong.

---

II.

I folded environment setup into a Linux/bash/CLI week. Not solve it. Teach it.

Students built their environments from scratch on a bare Linux install, or WSL if they were on Windows. Each tool installed individually: the JDK, git, a package manager, a database. Setup scripts so they could reproduce the state.

By the end of the week they had a theory of their machine. When something didn't work, they had somewhere to start looking.

---

III.

Four terminal windows:

```
# window 1 — build and run
mvn compile && mvn exec:java -Dexec.mainClass=App

# window 2 — version control
git status && git diff

# window 3 — scratch
jshell

# window 4 — docs / logs
man Arrays
```

This is IntelliJ.

Students who built this setup knew what each panel in the IDE was doing. They'd built the jank version first.

The ones who'd opened IntelliJ on day one treated it like a single tool. The ones who'd spent a week in four terminal windows knew it was four tools with a shared frame.

---

IV.

The same idea runs through most of what I build for class.

There's a Java HTTP server in my teaching repo that implements about fifteen percent of the Servlet spec. No session management, no filters, no security. Just a dispatch loop: parse the path, call the handler, write the response. Enough that a student understands what `@WebServlet` is doing — that it's a pattern, a path mapped to a class, a request object wrapping raw bytes. Once they've written the dispatch loop by hand, Spring MVC annotations aren't magic. They're shorthand for something they've already done.

---

Every workaround I ran through was solving the logistics problem.

The install hell was a jank dev environment. Jank doesn't need to be good. It needs to be legible.
