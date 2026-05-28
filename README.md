# mehrabr.github.io

Personal site for [mehrabr.com](https://mehrabr.com), built with [Jekyll](https://jekyllrb.com) and the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) theme.

## Adding a post

Create a file in `_posts/` named `YYYY-MM-DD-your-title.md` with this front matter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-06-01 09:00:00 -0700
categories: [Category]
tags: [tag1, tag2]
---
```

Then write your content in Markdown below the `---`. Push to `main` and GitHub Actions builds and deploys automatically.

## Custom domain

In your DNS registrar, set:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | mehrabr.github.io      |

In repo Settings → Pages, set custom domain to `mehrabr.com`.

## Local preview

```bash
bundle install
bundle exec jekyll serve
```

Requires Ruby 3.3+.
