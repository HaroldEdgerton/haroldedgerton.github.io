# Edgerton House Website

This repository contains the rebuilt Edgerton House website. The public site is generated with [Eleventy](https://www.11ty.dev/) into `site/`, and GitHub Pages deploys that generated folder.

## Repository Layout

- `src/` - editable Eleventy source files, shared layout, navigation data, and copied public assets.
- `src/_includes/layout.njk` - shared HTML shell for normal pages.
- `src/_data/navigation.json` - top navigation, dropdown menus, footer links, and quick links.
- `site/` - generated static output. This is what GitHub Pages publishes.
- `legacy/raw-mirror/` - archived WordPress mirror used as source material only. Do not edit it.
- `legacy/text/` - text extraction from the legacy website.
- `tools/convert-site-to-eleventy.mjs` - one-time migration helper used to convert the generated static site into Eleventy templates.
- `tools/build-site.mjs` - earlier static-site generator kept for reference; current builds use Eleventy.

## Local Setup

Install dependencies:

```sh
npm install
```

Build the site:

```sh
npm run build
```

Preview the site locally:

```sh
npm run serve
```

Then open `http://localhost:8001/`.

## Publishing

GitHub Pages is configured through `.github/workflows/pages.yml`.

On every push to `main`, GitHub Actions:

1. Installs Node dependencies with `npm ci`.
2. Builds the Eleventy site with `npm run build`.
3. Uploads `site/` to GitHub Pages.

The GitHub Pages settings should use **GitHub Actions** as the source, not a branch/folder publishing source.

## Common Updates

To change navigation or footer links, edit:

```text
src/_data/navigation.json
```

To edit a page, edit the matching file under `src/`. For example:

```text
src/resources/reservations/index.njk
src/living-here/floor-plans/index.njk
src/about/staff/index.njk
```

To add images, PDFs, or other downloadable files, place them under:

```text
src/assets/
```

Files copied from the old website may also live under `src/wp-content/` or `src/new/` when preserving legacy URLs is useful.

## Reservations

The reservation page currently submits to Formspree:

```text
https://formspree.io/f/xgodgkaa
```

Update `src/resources/reservations/index.njk` if that endpoint changes.

## Legacy Content Policy

The site intentionally keeps only a small recent news archive in the main navigation. Older WordPress URLs are represented as redirect pages where useful, but the old WordPress theme, admin pages, feeds, comments, plugin markup, and generated cruft should not be brought forward.
