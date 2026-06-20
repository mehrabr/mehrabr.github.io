---
layout: post
title: "text-to-sql is a solved demo"
date: 2026-06-20 09:00:00 -0700
categories: [Engineering]
tags: [text-to-sql, ai, duckdb, llms, agents]
---

The demo always works. You ask for revenue by region, it writes the join, the number comes back, everyone nods. Then you point it at a real database and ask for something the data doesn't hold, and it answers anyway, in the same tone, with the same confidence. The first time I ran mine against a real schema it gave me a customer's email address. There is no email column.

The number is wrong and it sounds exactly like the numbers that are right. That's the whole problem.

---

I.

The first fix is cheap, the kind of thing you do before spending real money: run the query and let the database complain. If it doesn't parse, or it names a column that isn't there, DuckDB tells you exactly what's wrong, and you hand that straight back to the model.

```
Binder Error: Referenced column "l_ship_mode" not found in FROM clause!
Candidate bindings: "l_shipmode", "l_extendedprice"
```

Most mistakes die right there, for free, before you've paid for a second model call. The rest of the ladder costs more, and you climb it only when the cheap checks come back clean and you still don't trust the answer — a sanity look at the result, then a call that translates the SQL back into English to check it against what was actually asked, then, when things have already gone shaky, a handful of independent runs you compare against each other. How far you climb is mostly a budget question.

---

II.

None of that touches the column that doesn't exist.

You can catch the error, sure — the query won't run — but a model that just retries will keep inventing columns until one of them happens to parse, and then you've got a confident wrong answer that executes fine. Another check downstream won't save you. The agent itself has to look at the question and decide there's nothing here to answer.

```yaml
- id: u_customer_email
  question: What is the email address of customer 1?
  kind: unanswerable
```

There's no column to bind. The right output is no output. Refusing has to be something the agent does on purpose.

---

III.

Then there's the opposite problem — questions with more than one right answer.

Ask for the top five customers and you've left out the part that matters: top by what? Lifetime spend, account balance, order count — each is a perfectly good reading, and each comes back with a different five people. The agent has to pick a lane and write correct SQL for it.

```yaml
- id: a_top_customers
  question: Who are the top five customers?
  kind: ambiguous
  acceptable_sql:
    - "... ORDER BY sum(o_totalprice) DESC ..."
    - "... ORDER BY c_acctbal DESC ..."
    - "... ORDER BY count(*) DESC ..."
```

Mark it wrong for picking spend over balance and you're grading the question for being vague, not the agent. So any defensible reading counts. What's being measured is whether it landed on a sane interpretation, not whether it read my mind.

---

IV.

Once you start grading all this, "gave up" turns out to be two completely different things wearing the same face: the agent that correctly refused an impossible question, and the agent that choked on one it should have answered. From the outside they're identical — same empty hands either way.

So you score them apart.

```python
if q.kind == "unanswerable":
    return res.gave_up
```

For an unanswerable question, giving up is the right answer and a query that runs is a failure. The metric splits in two. Decline recall: of the questions with no answer, how many it refused. Decline precision: of everything it refused, how much was the right call — low precision means it's bailing on work it could've done. A give-up only earns its keep once you can show it knew which kind it was looking at.

For the answerable ones, correct means the rows match, not the SQL. Two queries can look nothing alike and still come back with the same answer, so you compare the results as multisets with a little tolerance on the floats. Grade the SQL string instead and you'll fail the agent for the crime of writing the query differently than you would have.

---

V.

When the agent's unsure, the obvious move is to ask it again and see if the answers line up. Drawing the samples is the easy part. The catch is that the answers line up too easily.

Think of it like witnesses. Three who independently describe the same car tell you something. Three who got together and compared notes first tell you nothing, however perfectly they agree — they've just talked each other into one story. Language models are the second kind by default. Show one its own earlier draft, or let the second see what the first wrote, and they fold toward agreement because agreeing is what they do. The answer didn't get any better; they just coordinated. So you draw the samples blind, no shared context, and only then cluster them by whether they returned the same rows. Agreement counts only when the things agreeing never got to coordinate.

---

VI.

The standard way to test text-to-SQL is TPC-H — a fixed schema and twenty-two canonical queries everyone benchmarks against.

Every one of those twenty-two has been sitting in the training data of every model worth using, many times over, in the open. Score against them and you learn the model can reproduce query 14, not that it understood the schema well enough to write it. A benchmark measures capability right up until it gets famous, and then it measures memory.

So I wrote my own — sixty-four questions over that same schema, none of them the canonical ones. The fix was never about the scorer. It was getting questions the model couldn't have already seen the answers to.

---

VII.

The [repo](https://github.com/mehrabr/agentic-duckdb-analyst) reports 98.4%.

"So it works." The 98.4% is the harness grading itself against a mock that hands back known-correct SQL — it tells you the ruler is straight, not that any model is good. The one miss is a give-up I rigged on an answerable question on purpose, so decline precision would fall to 8/9 and prove the metric can actually tell a bad refusal from a good one.

I published the number that doesn't flatter me, caveat and all, because the harness is the thing I built and that score is just the harness checking its own work. The real numbers come from pointing it at a live model. They'll be lower. The buckets where they're lowest are the entire point.

---

VIII.

Writing an agent that spits out SQL took an afternoon. Everything after that — the ladder, the refusals, the scoring that separates a good refusal from a bad one, the questions chosen so the model couldn't have memorized them — was the actual work, and none of it is the agent. It's the ruler.

The default failure of these things is a fluent wrong answer. The thing worth building is the one that comes back with nothing, on purpose, and is right to — and it only counts if you can prove it knew the difference.
