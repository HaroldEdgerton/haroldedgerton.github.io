# Contributing

This site is meant to be maintainable by future Edgerton House IT chairs without needing to understand the old WordPress site.

## Editing Rules

- Edit files in `src/`, not `site/`.
- Treat `site/` as generated output from `npm run build`.
- Do not edit `legacy/raw-mirror/`; it is an archival source.
- Keep pages semantic and simple. Prefer ordinary HTML in `.njk` files over custom JavaScript.
- Preserve useful old URLs with redirect pages when changing page locations.
- Do not restore WordPress admin, login, feed, comment, plugin, analytics, or tracking machinery.

## Workflow

1. Create a branch for your change.
2. Edit the relevant files in `src/`.
3. Run:

```sh
npm run build
```

4. Open the rebuilt site locally and check the changed pages.
5. Commit the source changes and any intentional generated changes in `site/`.
6. Open a pull request or push to `main`, depending on the repository process.

## Adding Or Editing Pages

Most pages are `.njk` files with front matter:

```njk
---
layout: layout.njk
title: "Example Page"
description: "Short page description."
mainClass: "main-standard"
permalink: "/example/"
---
<section class="page-intro">
  <p class="eyebrow">Section</p>
  <h1>Example Page</h1>
</section>
```

Use `main-wide` for pages that need wider calendars, image grids, or dashboards. Use `main-standard` for ordinary text pages.

## Navigation

Dropdowns and footer links come from:

```text
src/_data/navigation.json
```

Keep the navigation short. If a page is important but not top-level, put it in the relevant dropdown instead of adding another top-level link.

## Assets

Use descriptive filenames and place new public files under:

```text
src/assets/
```

If a legacy PDF or image must keep its old URL, preserve it under `src/wp-content/` or `src/new/`.

## Forms And Calendars

External forms, calendars, and reservation systems are embedded or linked from static pages. Keep those service links visible in the relevant page source so future maintainers can update them quickly.

The reservation form uses Formspree. If ownership changes, update the endpoint in:

```text
src/resources/reservations/index.njk
```

## Review Checklist

Before publishing, check:

- The page builds with `npm run build`.
- Header dropdowns still work on desktop and mobile.
- Search results still load at `/search/`.
- Reservation form still points to the intended Formspree endpoint.
- Important PDFs and images still load.
- Old URLs that residents may have bookmarked still redirect.
