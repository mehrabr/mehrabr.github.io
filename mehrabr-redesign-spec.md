# mehrabr.com — Redesign Specification

**Status:** Draft for review
**Scope:** Visual identity, information architecture, and page structure for mehrabr.com
**Current stack:** Jekyll 4.x + gem-based `jekyll-theme-chirpy ~> 7.3`, built via GitHub Actions (`bundle exec jekyll build`, `JEKYLL_ENV=production`) and deployed to GitHub Pages on the `mehrabr.com` custom domain.
**Author of record:** Mehrab Rahman

---

## 1. Executive summary

The site is currently the stock Chirpy theme with **zero local overrides** — the repo contains only content (`_posts`, `_tabs`), the favicon set, an avatar, and three hand-built standalone demo pages. All layout, typography, and color come from the gem.

The problem is not quality; it's a mismatch. The three on-site demos — the holdout *Deliberation Viewer*, the CleanStart *Container Analyzer*, and the *Sandbox Dashboard* — are each a fully-realized visual world with its own palette and type system. The Chirpy shell that wraps the rest of the site carries none of that personality, and clicking from the generic shell into a bespoke demo (and back) produces visible whiplash.

This spec does three things:

1. **Defines one house design system**, derived from your own holdout demo (so it is provably yours, not a template), that the whole site adopts and the demos visually join.
2. **Restructures information architecture** so the front door sells the work: a real home page, a Projects *showcase* (not a markdown list), and a clean separation between your build logs and your teaching essays.
3. **Recommends a build architecture** — keep Chirpy as the blog engine, make the portfolio surfaces bespoke, reskin the blog to match — and lays out the alternatives with honest trade-offs so the engine choice is yours to make.

**Goals**
- A front door that, within five seconds, communicates who you are and surfaces 2–3 built things worth clicking.
- The Projects page reads as a portfolio, not a blog post: cards, status, stack, prominent demo/repo actions.
- One coherent visual identity across chrome, portfolio, blog, and demos.
- Keep the blogging machinery you actively use (you publish ~2–3×/week).
- Ship incrementally; no big-bang rewrite.

**Non-goals**
- Rewriting post or project *copy* (it's strong — it stays).
- Redesigning the *interiors* of the three demos (they stay; they only gain a shared header and shared fonts).
- Adding a CMS, comments, or analytics as part of this work (separate, optional toggles).

---

## 2. What's working (preserve, don't touch)

- **The writing and the voice.** Lowercase titles, concrete openings, no throat-clearing. Consistent and distinctive.
- **The Projects copy.** Every entry leads with the gap it fills. This is unusually good portfolio writing; the redesign reframes it visually but keeps the words.
- **The intellectual through-line.** "Build something minimal enough to hold in your head, then watch where it gets complicated" ties the blog, the projects, and the demos into one point of view.
- **The demos themselves.** They prove design taste and a willingness to hand-build. They become the reference implementation for the house style, not something to redo.

---

## 3. Design direction

### 3.1 The brief, pinned

> A personal site for a principal engineer who writes essays and ships small, opinionated tools. The audience is other senior engineers, potential collaborators, and the occasional hiring manager. The page's single job: **make the work legible at a glance and worth clicking into.**

### 3.2 The signature: the receipt

Your intellectual brand is *making reasoning legible and keeping the trace*: holdout is "a deliberation, made legible"; marchland gives "every death a cause you can read"; your text-to-sql work is about not trusting an answer that "sounds exactly like the numbers that are right." The design signature follows from that idea, not from decoration:

**Metadata is shown, not hidden.** Every post and every project carries a visible **receipt** — a single mono-set line of its facts. For a post: `2026-06-20 · engineering · 6 min`. For a project: `shipped · Go · DuckDB · MotherDuck`. The receipt is the one repeated element the site is remembered by, and it encodes something true (this is "structure is information," not numbered stickers for flavor). It also does real navigational work — it's how a reader sorts your duck-data content from your teaching content at a glance.

Everything else stays quiet so the receipt and the content carry the page.

### 3.3 Type

Lifted directly from your holdout demo so that demo *is* the design-system reference, and the other two demos can adopt the same roles over time while keeping their own accents.

| Role | Typeface | Use |
|---|---|---|
| Display / UI | **Space Grotesk** (400–700) | Wordmark, headings, nav, buttons, card titles |
| Reading | **Newsreader** (serif, optical sizes) | Long-form **post body** only |
| Utility / data | **JetBrains Mono** (400–500) | The receipt line, eyebrows, tech badges, status pills, code, dates |

Rationale and anti-default note: the serif is used for **body reading**, not as a giant high-contrast display face — that deliberately avoids the "cream + serif display + terracotta" AI-design cliché. Mono-as-connective-tissue is the real through-line across all three of your demos, so it earns its central role here.

### 3.4 Color

Primary mode is your holdout **slate**, not a cream background — again, a deliberate step away from the default cream look. An optional light mode reuses your *Sandbox* demo's warm paper (`#f5f2eb`), not the generic `#F4F1EA`.

```css
/* Design tokens — canonical values. Implement as SCSS partial _design/_tokens.scss
   (hybrid path) or assets/css token layer (bespoke path). Single source of truth. */
:root {
  /* dark (primary) — from holdout "chamber" */
  --bg:        #181B27;
  --surface:   #1E2130;
  --surface-2: #23273A;
  --edge:        rgba(233,235,241,.09);
  --edge-strong: rgba(233,235,241,.16);
  --text:      #EAECF2;
  --text-soft: #969CB0;
  --text-faint:#6B7185;   /* decorative / large only — see A11y */
  --accent:      #D9AC50; /* brass */
  --accent-deep: #B98E36;
  --accent-glow: rgba(217,172,80,.16);
  /* "pulled" paper card surface, for featured items */
  --paper:      #EFE9DB;
  --paper-edge: #D8CFB8;
  --paper-ink:  #26221A;
  --paper-soft: #6C6453;
  --radius: 12px;
  --radius-sm: 8px;
}
:root[data-mode="light"] {
  /* light (optional) — from Sandbox demo */
  --bg: #F5F2EB; --surface: #FFFFFF; --surface-2: #EFEAE0;
  --edge: #E2DCD0; --edge-strong: #D4CEC4;
  --text: #0D0F14; --text-soft: #5A5446; --text-faint: #8A8478;
  --accent: #B98E36; --accent-deep: #8A6A28; /* NB: brass-deep for text in light mode */
}
```

**Accent usage rule (accessibility-critical):** brass (`#D9AC50`) reads well as text **on slate** and as a fill with dark text. In **light mode it must not be used as text on paper** (light-on-light fails contrast) — there it is a fill/underline/rule only, and text uses `--accent-deep` or ink. Stated here so the implementer doesn't trip on it.

### 3.5 Layout, motion, radii

- **Drop the left sidebar.** It is the single most recognizable "this is Chirpy" tell. Replace with a slim **top bar**: wordmark left, nav right (Projects · Writing · About), theme toggle far right.
- **Column widths:** prose reading column ~`68ch` (~680–720px); the home and projects grids span wider (max ~1040px) with a 2–3 column card grid collapsing to 1 on mobile.
- **Radii:** soft (8–12px), matching your demos' cards — not the zero-radius broadsheet cliché.
- **Ambient motif:** the faint dotted-grid background you already use in two demos, at very low contrast, used once (behind the home hero), not everywhere.
- **Motion:** restrained. A short page-load reveal on the home hero (stagger the wordmark → tagline → featured cards). Hover micro-interactions on cards (you already do `translateY(-1px)` + edge brighten). Everything wrapped in `@media (prefers-reduced-motion: reduce)`.

### 3.6 Wireframes

```
HOME (/)
┌───────────────────────────────────────────────────────────────┐
│  mehrab rahman·                       projects  writing  about ◐│  ← top bar (sitewide)
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│   Principal engineer. Distributed systems, data engineering,    │  ← identity block
│   building in public.                                           │     (Space Grotesk)
│   ┌ mono sub-line: I build small things to find out how much   │
│   └ enterprise complexity is actually necessary.               │
│                                                                 │
│   FEATURED                                                      │  ← mono eyebrow
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│   │ holdout      │ │ waddler      │ │ cleanstart   │           │  ← paper "pulled" cards
│   │ one-line pitch│ │ one-line pitch│ │ one-line pitch│         │
│   │ shipped·Py·LLM│ │ shipped·Go·Dk │ │ demos·Node·MCP│         │  ← receipt
│   │ [demo] [repo] │ │ [repo]        │ │ [demos][repo] │         │  ← actions
│   └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
│   LATEST WRITING                                  all writing → │
│   ─ text-to-sql is a solved demo   2026-06-20 · engineering     │  ← receipts as the
│   ─ rules of thumb                 2026-06-19 · teaching        │     scanning device
│   ─ i was the model                2026-06-17 · teaching        │
│   ─ they quack now                 2026-06-14 · data eng        │
└───────────────────────────────────────────────────────────────┘

PROJECTS (/projects/) — card grid, driven by _projects collection
┌──────────────────┐  ┌──────────────────┐
│ holdout    shipped│  │ waddler    shipped│   status pill top-right
│ ───────────────── │  │ ───────────────── │
│ pitch paragraph   │  │ pitch paragraph   │
│ Python · LLMs     │  │ Go · DuckDB · MD  │   tech badges (mono)
│ [live demo] [repo]│  │ [repo]            │   buttons
└──────────────────┘  └──────────────────┘
( in-progress items get a muted treatment + "in progress" pill )

POST (/writing/.../)
┌───────────────────────────────────────────────────────────────┐
│  top bar                                                        │
├───────────────────────────────────────────────────────────────┤
│  text-to-sql is a solved demo                                   │  ← Space Grotesk H1
│  2026-06-20 · engineering · 6 min · text-to-sql ai duckdb       │  ← receipt
│                                                                 │
│  Body set in Newsreader, ~68ch, generous leading.    [ TOC ]    │  ← Chirpy TOC kept
│  Code blocks: JetBrains Mono on --surface-2, rouge highlight.   │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Information architecture

### 4.1 Navigation

Top bar, sitewide, four destinations:

`mehrab rahman` (home) · **Projects** · **Writing** · **About** · ◐ (theme toggle)

**Resolve the current nav inconsistency.** Today `CleanStart` and `holdout` occupy top-level tabs while waddler and the agentic analyst do not, and the About page's nav is missing those two tabs entirely (a stale build — see §8). The reason cleanstart/holdout were promoted is real: they host **on-site interactive demos**, which the others don't. But top-level nav is the wrong place to express that. Instead:

- Demote `cleanstart` and `holdout` from top-level tabs. They become entries in the Projects collection like everything else.
- Projects that have an on-site demo are marked in data (`demo_local`) and rendered with a prominent **Live demo** action everywhere they appear. The distinction stays legible; it just stops eating nav slots.
- This scales: the next project with a demo needs no nav surgery.

### 4.2 Two content streams

The blog interleaves **teaching essays** (install day, rules of thumb, student motivation) and **engineering/build logs** (waddler, they quack now, text-to-sql). Different readerships. The receipt line's category token is the primary sort device. On `/writing/`, add lightweight category filters (All · Engineering · Teaching · Projects) — these map to your existing `categories` front matter and `jekyll-archives` already generates the category pages, so the filter is a thin UI over data you already have.

### 4.3 Surfaces

| Surface | Path | Job |
|---|---|---|
| Home | `/` | Identity + featured work + latest writing |
| Projects | `/projects/` | Full showcase grid |
| Project page | `/projects/:slug/` | Optional deep page per project (esp. ones with demos) |
| Writing | `/writing/` | Blog index with category filter + pagination |
| Post | `/writing/:categories/:y/:m/:d/:title/` | The reading experience |
| About | `/about/` | Bio, history, stack, contact |
| Demos | `/holdout/…`, `/cleanstart/…` | Unchanged interiors; shared header + fonts |

> Note: moving the blog index off `/` to `/writing/` has a pagination implication — see §8 and §9.

---

## 5. Content model

### 5.1 Projects become a collection

Today projects are prose inside `_tabs/projects.md`, **and** cleanstart/holdout are *also* described in their own `_tabs/*.md` pages — duplicated content that can drift. Replace with a single `_projects` collection. Each project is one file; the same data drives the home featured cards, the Projects grid, the optional project page, and the demo affordances.

`_config.yml` addition:

```yaml
collections:
  projects:
    output: true
    sort_by: order
    permalink: /projects/:name/
defaults:
  - scope: { path: "", type: projects }
    values: { layout: project }
```

Per-project front-matter schema (`_projects/holdout.md`):

```yaml
---
title: holdout
slug: holdout
order: 1
featured: true                 # surfaces on the home page
status: shipped                # shipped | in-progress
pitch: >-                      # one line, used on cards (your voice)
  Asks several LLMs to reason independently, seals each rationale before
  reveal, and preserves the disagreement instead of dissolving it.
tech: [Python, LLMs]
repo: https://github.com/mehrabr/holdout
demo_url: https://mehrabr.github.io/holdout/   # external/canonical demo
demo_local: /holdout/holdout-deliberation.html # on-site demo → "Live demo" action
thumb: /assets/img/projects/holdout.png        # optional screenshot/GIF
---

Full prose body (your existing Projects copy, verbatim) renders on the
project page. Cards use only the front-matter `pitch`.
```

Migration: move each project's existing paragraphs from `_tabs/projects.md` (and the cleanstart/holdout tab pages) into the body of its `_projects/*.md` file; lift the one-liners into `pitch`. Then delete `_tabs/projects.md`, `_tabs/cleanstart.md`, `_tabs/holdout.md`. Keep `_tabs/about.md`.

### 5.2 Posts

Front matter is already good (`title`, `date`, `categories`, `tags`). One addition for social sharing: an optional `image:` per post (see §9, OG cards). No content changes.

---

## 6. Page specifications

### 6.1 Home (`/`)
- **Identity block:** tagline in Space Grotesk; the "build small things…" line beneath in mono `--text-soft`.
- **Featured:** mono eyebrow `FEATURED`; 2–3 **paper "pulled" cards** (the `--paper` surface, the one place the warm paper appears on the slate page, making featured work literally stand out). Each card: title, `pitch`, receipt (`status · tech`), actions (`Live demo` if `demo_local`/`demo_url`, `GitHub`). Cards come from `_projects` where `featured: true`, ordered by `order`.
- **Latest writing:** mono eyebrow; 4–5 most recent posts as title + receipt rows; `all writing →` to `/writing/`.
- **Acceptance:** a first-time visitor sees identity, ≥2 demoable projects with working demo links, and recent writing without scrolling past one viewport on desktop. Loads with no layout shift. Reduced-motion users get the same content, no animation.

### 6.2 Projects (`/projects/`)
- Intro line (your existing "A running list of things I've built…").
- **Card grid** from `_projects` (all), 2–3 cols → 1 on mobile, ordered by `order`, in-progress items visually muted with an `in progress` pill.
- Card: title, `status` pill (top-right), `pitch`, `tech` badges (mono), actions. Optional `thumb` shown if present.
- **Acceptance:** every project shows status, stack, and at least one working action (repo or demo). No project renders as an undifferentiated wall of prose. Tab/keyboard order is title → actions per card.

### 6.3 Project page (`/projects/:slug/`)
- Hero: title, receipt, actions. Then the full prose body. For demo projects, embed or prominently link the on-site demo near the top.
- **Acceptance:** reachable from each grid card; demo projects expose the live demo above the fold.

### 6.4 Writing (`/writing/`)
- Post list (title + receipt + excerpt), category filter chips (All · Engineering · Teaching · Projects), pagination.
- **Acceptance:** filter reflects `categories`; pagination works at the `/writing/` path (requires paginate-v2, §9); RSS link present.

### 6.5 Post
- Chirpy's reading internals kept (TOC, rouge highlighting, footnotes) inside the new shell. Body in Newsreader, code in JetBrains Mono on `--surface-2`. Receipt under the H1.
- **Acceptance:** identical reading affordances to today (TOC, copy-code, anchored headings), restyled to the design system; AA contrast on body and code.

### 6.6 About
- Keep the content. Add a visible **contact block** (see §9 — email is configured but currently buried as a sidebar icon). One line of availability if applicable.

---

## 7. Component specifications

All components are design-system primitives shared by bespoke pages and the reskinned blog (one SCSS source).

| Component | Spec |
|---|---|
| **Top bar** | Sticky, `--bg` with bottom `--edge`. Wordmark (Space Grotesk, brass `·` accent like your holdout wordmark). Nav links mono-ish small caps, `--text-soft` → `--text` on hover. Theme toggle cycles dark/light/system. Collapses to a menu on mobile. Visible focus ring on every control. |
| **Receipt** | Mono, `--text-faint`/`--text-soft`, `·`-separated. Post: `date · category · read-time · tags`. Project: `status · tech…`. One include, two data shapes. |
| **Project card** | `--surface` (grid) or `--paper` (featured). Title (Space Grotesk), status pill, pitch, tech badges, actions. Hover: `translateY(-1px)` + `--edge` → `--edge-strong`. |
| **Tech badge** | Mono, small, `--surface-2` fill, `--text-soft`. Not a link. |
| **Status pill** | `shipped` → brass outline; `in progress` → `--text-faint` outline, muted. Top-right of card. |
| **Action button** | Primary (`Live demo`): brass fill, dark text. Secondary (`GitHub`): `--edge-strong` outline, `--text`. Same label through to destination. |
| **Pulled paper card** | The featured-only `--paper`/`--paper-ink` treatment; brass top-rule like holdout's card `::before`. The deliberate figure/ground moment. |
| **Footer** | Quiet. Copyright, GitHub, email, RSS. Drop the "Using the Chirpy theme" credit line if going bespoke; keep attribution in repo README/LICENSE instead. |

---

## 8. Build architecture — the engine decision

You invited moving off Chirpy. Here is the honest read.

The design win lives on three surfaces — **home, projects, project pages**. The blog's *reading* experience is not where distinctiveness sells, and Chirpy gives you, for free, a stack that's annoying to rebuild: TOC generation, rouge syntax highlighting, `jekyll-archives` tag/category pages, client-side search, image lightbox, RSS, footnotes, and a dark-mode toggle. Ejecting all of that to gain design control over pages where it barely matters is a poor trade.

So the recommendation is **not** a full eject. It's a hybrid that makes the surfaces that sell fully bespoke while Chirpy keeps doing the blog plumbing — inside a shared shell so the whole site looks like one thing.

### 8.1 Recommended: hybrid (Chirpy as engine, bespoke skin + surfaces)

- **One site shell** (top bar + footer), bespoke and design-system-styled, applied **sitewide** — by overriding Chirpy's base `default` layout and replacing its `sidebar` include with the new top bar. This is the moderate-surgery part, and it's what buys a consistent identity across portfolio *and* blog.
- **Portfolio surfaces** — new bespoke layouts (`home`, `projects`, `project`) that render inside the shell, full custom design, driven by `_projects`.
- **Blog surfaces** — keep Chirpy's post/tag/category/TOC/search internals, reskinned to the palette and type via Chirpy's SCSS entrypoint (`assets/css/jekyll-theme-chirpy.scss` importing the theme + your override layer) plus the shared token partial.
- **Demos** — interiors unchanged; add the shared top bar + a `← back to site` affordance + the shared Google Fonts links.

Proposed repo additions:

```
_data/projects/            (or _projects/ collection per §5)
_layouts/
  home.html                bespoke
  projects.html            bespoke
  project.html             bespoke
  default.html             override Chirpy base → use new shell
_includes/
  site-header.html         top bar + theme toggle
  site-footer.html
  receipt.html
  project-card.html
  tech-badges.html
_sass/
  _tokens.scss             design tokens (single source of truth)
  _components.scss         card / badge / pill / button / receipt
assets/css/
  jekyll-theme-chirpy.scss override entrypoint: @import theme, then overrides
  main.scss                styles for bespoke layouts
assets/img/projects/       screenshots / GIFs
```

**Cost:** overriding `default.html` + `sidebar` means tracking Chirpy on major version bumps (you're on `~> 7.3`; pin it and upgrade deliberately). That's the main ongoing tax, and it's modest.

### 8.2 Alternative A: full bespoke theme (zero Chirpy)

Drop the gem; write ~6 layouts (`default`, `home`, `projects`, `project`, `page`, `post`) + tag/category templates from scratch. **Reusable as-is:** `jekyll-archives`, `jekyll-seo-tag`, `jekyll-sitemap`, and `jekyll-paginate-v2` (you build via Actions with `bundle exec`, so you are **not** restricted to the GitHub Pages plugin whitelist — confirmed in `pages-deploy.yml`). **Must reimplement:** dark-mode toggle, client-side search, image lightbox, TOC, copy-code button, and the polished post CSS. Total design control, no gem to fight, but you own the blog plumbing forever. Viable given your demonstrated skill — but more work for upside concentrated on pages that aren't the blog.

### 8.3 Alternative B: pure skin (CSS only, minimal effort)

Add only `assets/css/jekyll-theme-chirpy.scss` overrides — recolor, retype, retd the sidebar. Lowest effort, ships in an afternoon. **Won't escape the Chirpy structure** (the sidebar layout stays), so it's the smallest design payoff. Reasonable as a Phase-1 stopgap, not the destination.

### 8.4 Comparison

| | Design ceiling | Effort | Blog features kept | Ongoing maintenance |
|---|---|---|---|---|
| **Hybrid (rec.)** | High on portfolio, good on blog | Medium | All (free) | Low–medium (track Chirpy on upgrades) |
| Full bespoke | Highest everywhere | High | Rebuild several | Medium (you own it all) |
| Pure skin | Low | Lowest | All | Low |

**Recommendation: hybrid.** ~95% of the design win at ~40% of the cost of a full eject, and it keeps the publishing workflow you use weekly.

---

## 9. Correctness fixes and quick wins

Independent of the engine choice; several are one-liners. Do these first (Phase 0).

1. **Allow zoom.** The viewport tag ships `user-scalable=no` (a Chirpy default) — it blocks pinch-zoom, an accessibility failure and a Lighthouse ding. Override Chirpy's `head` include to emit `width=device-width, initial-scale=1, viewport-fit=cover` without `user-scalable=no`.
2. **Fix the stale About build.** About renders on Chirpy `v7.5.0` while home/projects are `v7.6.0`, and About's nav is missing the cleanstart/holdout tabs. This is a cached/partial build artifact — trigger a clean rebuild (clear the Pages build cache / re-run the workflow). The IA change in §4 supersedes the missing-tabs issue, but the version skew should not persist.
3. **Make contact discoverable.** `social.email: mehrabmrahman@gmail.com` is configured, so Chirpy renders an email icon in the sidebar — but it's a small glyph most visitors miss, and the About page's text only says "Find me on GitHub." Add an explicit contact line on About (email + GitHub, LinkedIn if you want), and keep them in the new footer. If GitHub-only is a deliberate spam-avoidance choice, ignore this.
4. **Upgrade social cards.** `twitter:card` is `summary` (tiny preview). For a build-in-public author, switch to `summary_large_image` and set a per-post `image:` (or generate simple cards). Posts travel far better when shared.
5. **Pagination at `/writing/`.** Classic `jekyll-paginate` (v1, currently in your Gemfile) only paginates the root `index.html` and cannot paginate a custom path or collection. Moving the blog index to `/writing/` requires **`jekyll-paginate-v2`** (supports custom paths + category/tag pagination). Swap the gem; it works because you build with `bundle exec`, not the Pages gem.
6. **404 page.** Add a branded `404.html` in the design system (Chirpy ships a generic one; make it yours, with a `← home` and a link to `/writing/`).

---

## 10. Accessibility and performance bar

A quality floor, not optional polish.

- **Contrast (verify at build):** body `--text` on `--bg` is high-contrast (pass). `--text-soft` for receipts on `--bg` — verify ≥ 4.5:1 for any meaningful text; `--text-faint` is **decorative/large only** unless it clears AA. Brass on slate passes for text; brass on paper does **not** (light mode uses `--accent-deep`/ink for text — see §3.4).
- **Keyboard:** visible focus ring on every link, button, card action, the theme toggle, and the mobile menu. Logical tab order (card → its actions).
- **Reduced motion:** all hero/scroll/hover animation gated behind `prefers-reduced-motion: reduce`; content identical without motion.
- **Fonts:** `preconnect` to Google Fonts, `display=swap`, and subset to the weights listed in §3.3 (you currently load extra Newsreader/Space Grotesk axes in holdout — trim for the sitewide load). Target: no FOIT, minimal CLS.
- **No-JS baseline:** content, nav, and links work without JS; JS enhances (theme toggle, filters, lightbox).
- **Responsive:** single breakpoint family — grids collapse 3→2→1; top bar → menu; reading column never exceeds ~68ch.
- **Lighthouse targets:** Performance ≥ 95, Accessibility = 100, Best Practices ≥ 95, SEO = 100 on the home and a representative post.

---

## 11. Phasing

Each phase is independently shippable; nothing blocks publishing in between.

- **Phase 0 — Fixes (hours).** §9 items 1–3, 6. Pure wins, no redesign.
- **Phase 1 — Design system + shell (1 sitting).** Token partial, Space Grotesk/Newsreader/JetBrains Mono loaded, top bar + footer shell, Chirpy blog reskinned to the palette/type. Site already looks like a new site.
- **Phase 2 — Projects collection + grid.** Migrate `_tabs` project prose into `_projects`; build the grid; delete the old tab pages; demote cleanstart/holdout from nav. The Projects page now reads as a portfolio.
- **Phase 3 — Home.** Identity block + featured paper cards (from `featured: true`) + latest-writing list. The front door now sells.
- **Phase 4 — Project pages + demo harmonization.** Per-project `/projects/:slug/`; add shared header + `← back to site` + shared fonts to the three demos.
- **Phase 5 — Polish.** OG cards (§9.4), `/writing/` filters + paginate-v2 (§9.5), 404, motion pass, Lighthouse pass, self-critique against §10.

---

## 12. Open decisions (need your call)

1. **Engine path:** hybrid (recommended), full bespoke, or pure skin?
2. **Light mode:** ship the optional paper light mode, or dark-only?
3. **Featured three:** which projects lead the home page? (Suggest holdout + waddler + cleanstart — one of each flavor: reasoning tool, data tool, security/demos. Open to your ranking.)
4. **Blog location:** keep the feed at `/` (and make a *separate* `/projects` the showcase), or move the feed to `/writing/` and give `/` to the portfolio? (This spec assumes the latter — it's the stronger front door — but it's the bigger change and drives the paginate-v2 swap.)
5. **Demo accents:** let each demo keep its own accent (recommended — they read as distinct rooms), or unify all three to brass?
6. **Contact prominence** and **comments/analytics** (currently off): turn on as part of this, or leave for later?

---

*Once you've made the §12 calls — especially the engine path and the three featured projects — the next deliverable is a working build of Phase 1 + the home page so you can see it rather than read it.*
