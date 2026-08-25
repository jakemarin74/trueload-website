# trueload-website

Marketing site for the TrueLoad application. Plain static HTML, served by GitHub
Pages from the root of `main` at [trueloadapp.com](https://trueloadapp.com).

| Page | File |
|---|---|
| Home | `index.html` |
| Plans & Pricing | `plans/index.html` |
| Resource Library | `resources/index.html` — **generated**, see below |
| Terms of Service | `terms/index.html` |
| Privacy Policy | `privacy/index.html` |

Everything except the resource library is hand-written HTML with its own inline
`<style>` block. Edit those files directly.

---

# The Resource Library

`/resources/` is built from content files. **You never edit HTML to change it.**

```
content/resources.json     ← add or remove a PDF or an external link
content/guides/*.md        ← one markdown file per written guide
resources/files/*.pdf      ← the PDFs themselves live here
```

Change any of those and push. A GitHub Action rebuilds the pages and commits the
result. Nothing else to do.

**Do not edit `resources/index.html`, `resources/guides/*/index.html`, or
`sitemap.xml`** — they are generated and your changes will be overwritten on the
next build.

## Adding an external link

Open `content/resources.json` and add an entry to the `resources` list:

```json
{
  "title": "Vermont electrical permit requirements",
  "description": "One or two sentences on what this is and why someone would want it.",
  "category": "code",
  "type": "link",
  "url": "https://example.gov/permits",
  "source": "Vermont Division of Fire Safety"
}
```

`source` is optional and shows as a small label on the card.

## Adding a PDF

1. Put the file in `resources/files/`. Give it a clean, hyphenated name — it
   becomes the download URL.
2. Add an entry to `content/resources.json`:

```json
{
  "title": "Sample AHJ report",
  "description": "A complete TrueLoad report, exactly as it goes to the inspector.",
  "category": "guides",
  "type": "pdf",
  "file": "Sample-AHJ-Report.pdf",
  "updated": "2026-08-24"
}
```

The file size is measured at build time and shown on the card, so you don't
enter it.

**Host only what you have the right to distribute.** Third-party studies and
code text should be `type: "link"` pointing at the publisher. NFPA 70 in
particular is copyrighted and must never be rehosted — link to NFPA's free
access page instead.

## Adding a guide

Create a new file in `content/guides/`. The filename becomes the URL:
`content/guides/panel-labeling.md` → `/resources/guides/panel-labeling/`.

```markdown
---
title: How to Label a Panel an Inspector Will Accept
description: Shown on the card and used as the page description in search results.
category: guides
updated: 2026-08-24
featured: true
order: 3
---

Your content here, in ordinary markdown. Headings, **bold**, lists, links,
tables and quotes all work.
```

Front-matter fields:

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Page heading and card title |
| `description` | yes | Card text and the search-result snippet |
| `category` | yes | Must match a category id in `resources.json` |
| `updated` | no | `YYYY-MM-DD`. Shown on the page and in the sitemap |
| `featured` | no | `true` gives the card a highlighted border and sorts it first |
| `order` | no | Lower numbers sort earlier within a category |
| `slug` | no | Override the URL if you don't want the filename |

## Removing a resource

Delete its entry from `content/resources.json`, or delete the `.md` file from
`content/guides/`. If it was a PDF, delete the file from `resources/files/` too.

## Categories

Categories are the section headings and the filter buttons, defined at the top
of `content/resources.json`:

```json
{ "id": "code", "label": "Code & Standards", "blurb": "Shown under the heading." }
```

The `id` is what resources and guides refer to, and it becomes the anchor link
(`/resources/#code`). Sections with nothing in them are skipped automatically.

## Doing all of this from a browser

None of the above needs a clone. On github.com:

- **Edit a file** — open it and click the pencil icon.
- **Add a guide** — go to `content/guides/`, click *Add file → Create new file*.
- **Upload a PDF** — go to `resources/files/`, click *Add file → Upload files*,
  drag it in.

Commit to `main` and the Action does the rest, usually within a minute.

## If something is wrong with the content

The build **fails rather than shipping a broken page**, and the live site is
left untouched. It catches a category that doesn't exist, a PDF that isn't
there, a guide missing its title, a duplicate URL, and malformed JSON — and
says which entry and what's wrong.

Check the failure under the repo's **Actions** tab.

## Building locally

```bash
npm install
npm run build:resources
```

Then open `resources/index.html` in a browser.
