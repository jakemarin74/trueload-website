#!/usr/bin/env node
/**
 * Builds the resource library from content/ into static HTML.
 *
 *   content/resources.json   ->  PDFs and external links
 *   content/guides/*.md      ->  one page each, plus a card on the index
 *
 * Outputs (all generated - never hand-edit):
 *   resources/index.html
 *   resources/guides/<slug>/index.html
 *   sitemap.xml
 *
 * Run with: npm run build:resources
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://trueloadapp.com';

const CONTENT_JSON = path.join(ROOT, 'content', 'resources.json');
const GUIDES_DIR = path.join(ROOT, 'content', 'guides');
const OUT_DIR = path.join(ROOT, 'resources');
const FILES_DIR = path.join(OUT_DIR, 'files');

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const problems = [];
const fail = (msg) => problems.push(msg);

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  if (!m) return '';
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Minimal front-matter reader. Supports `key: value`, quoted strings,
 * booleans and numbers - which is everything the guide format uses.
 */
function parseFrontMatter(raw, label) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    fail(`${label}: missing front matter. The file must start with a --- block.`);
    return { data: {}, body: raw };
  }
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!kv) {
      fail(`${label}: cannot read front-matter line: ${line.trim()}`);
      continue;
    }
    let value = kv[2].trim().replace(/^["'](.*)["']$/, '$1');
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value !== '' && !Number.isNaN(Number(value))) value = Number(value);
    data[kv[1]] = value;
  }
  return { data, body: match[2] };
}

/* ------------------------------------------------------------------ *
 * Shared page chrome - kept byte-identical to the rest of the site
 * ------------------------------------------------------------------ */

const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue: #1a4fa0;
  --blue-dark: #133d80;
  --blue-light: #dbeafe;
  --yellow: #f5c518;
  --green: #16a34a;
  --green-light: #dcfce7;
  --slate-900: #0f172a;
  --slate-800: #1e293b;
  --slate-600: #475569;
  --slate-400: #94a3b8;
  --slate-200: #e2e8f0;
  --slate-100: #f1f5f9;
  --slate-50: #f8fafc;
  --white: #ffffff;
  --font: 'DM Sans', sans-serif;
  --mono: 'DM Mono', monospace;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font); background: var(--white); color: var(--slate-900); line-height: 1.6; }

/* Anchored headings clear the sticky nav */
[id] { scroll-margin-top: 110px; }

/* ── NAV (same as main site) ── */
nav {
  position: sticky;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 48px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.nav-logo img { height: 72px; display: block; }
.nav-right { display: flex; align-items: center; gap: 24px; }
.nav-back {
  font-size: 14px;
  font-weight: 500;
  color: var(--slate-600);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s;
}
.nav-back:hover { color: var(--slate-900); }
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--yellow);
  color: var(--blue-dark);
  font-weight: 700;
  font-size: 14px;
  padding: 10px 22px;
  border-radius: 8px;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  letter-spacing: 0.01em;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,197,24,0.35); }

/* ── PAGE HEADER ── */
.page-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 24px 40px;
  text-align: center;
}
.section-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 14px;
}
.page-header h1 {
  font-size: clamp(34px, 4.5vw, 52px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 12px;
}
.page-header p {
  font-size: 17px;
  color: var(--slate-600);
  max-width: 620px;
  margin: 0 auto;
}

/* ── FOOTER (same as main site) ── */
footer {
  border-top: 1px solid rgba(0,0,0,0.08);
  padding: 40px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.footer-logo img { height: 72px; display: block; }
.footer-disclaimer {
  font-size: 12px;
  color: var(--slate-600);
  max-width: 560px;
  line-height: 1.6;
}
.footer-link {
  font-size: 13px;
  color: var(--slate-600);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.footer-link:hover { color: var(--slate-900); }

@media (max-width: 768px) {
  nav { padding: 14px 20px; }
  .nav-logo img { height: 52px; }
  .nav-right { gap: 14px; }
  footer { flex-direction: column; align-items: flex-start; padding: 32px 20px; }
}
@media (max-width: 600px) {
  .nav-back { display: none; }
  .nav-cta { font-size: 13px; padding: 9px 16px; }
}
`.trim();

const INDEX_CSS = `
/* ── FILTER BAR ── */
.res-controls {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.res-filters { display: flex; gap: 8px; flex-wrap: wrap; }
.res-chip {
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  color: var(--slate-600);
  background: var(--white);
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 100px;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.res-chip:hover { background: var(--slate-50); color: var(--slate-900); }
.res-chip[aria-pressed="true"] {
  background: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}
.res-search {
  font-family: var(--font);
  font-size: 14px;
  color: var(--slate-900);
  background: var(--white);
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 10px;
  padding: 9px 14px;
  min-width: 240px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.res-search:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(26,79,160,0.12);
}
.res-search::placeholder { color: var(--slate-400); }

/* ── CATEGORY SECTIONS ── */
.res-sections { max-width: 1100px; margin: 0 auto; padding: 24px 24px 40px; }
.res-section { margin-bottom: 56px; }
.res-section-head { margin-bottom: 22px; }
.res-section-head h2 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.res-section-head p { font-size: 15px; color: var(--slate-600); max-width: 640px; }

.res-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  align-items: start;
}

/* ── CARD ── */
.res-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 14px;
  padding: 24px 24px 20px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}
.res-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.09);
  transform: translateY(-2px);
  border-color: rgba(0,0,0,0.16);
}
.res-card-featured {
  border: 1.5px solid rgba(26,79,160,0.3);
  box-shadow: 0 6px 28px rgba(26,79,160,0.10);
}

.res-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.res-type {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
}
.res-type-guide { background: rgba(26,79,160,0.10); color: var(--blue); border: 1px solid rgba(26,79,160,0.25); }
.res-type-pdf   { background: rgba(22,163,74,0.12); color: var(--green); border: 1px solid rgba(22,163,74,0.30); }
.res-type-link  { background: rgba(0,0,0,0.05);     color: var(--slate-600); border: 1px solid rgba(0,0,0,0.12); }

.res-source {
  font-size: 12px;
  color: var(--slate-400);
  font-weight: 500;
}

.res-card h3 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.35;
  margin-bottom: 8px;
}
.res-card h3 a { color: var(--slate-900); text-decoration: none; }
/* Whole card is the click target */
.res-card h3 a::after { content: ''; position: absolute; inset: 0; }
.res-card:hover h3 a { color: var(--blue); }

.res-card p {
  font-size: 14px;
  color: var(--slate-600);
  line-height: 1.6;
  margin-bottom: 18px;
  flex-grow: 1;
}

.res-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid rgba(0,0,0,0.07);
}
.res-action {
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
}
.res-detail {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--slate-400);
}

.res-empty {
  display: none;
  text-align: center;
  color: var(--slate-600);
  font-size: 15px;
  padding: 60px 24px;
}

/* ── CTA ── */
.cta-section { max-width: 1100px; margin: 0 auto; padding: 24px 24px 80px; text-align: center; }
.cta-section h2 { font-size: clamp(26px, 3.5vw, 34px); font-weight: 700; letter-spacing: -0.02em; margin-bottom: 14px; }
.cta-section p { font-size: 16px; color: var(--slate-600); margin-bottom: 30px; }
.cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--yellow); color: var(--blue-dark);
  font-weight: 700; font-size: 15px; padding: 14px 28px;
  border-radius: 10px; text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,197,24,0.4); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.15);
  color: var(--slate-800); font-weight: 500; font-size: 15px;
  padding: 14px 28px; border-radius: 10px; text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.btn-secondary:hover { background: rgba(0,0,0,0.09); border-color: rgba(0,0,0,0.25); }

@media (max-width: 768px) {
  .res-controls { padding: 0 20px 8px; }
  .res-search { min-width: 0; width: 100%; }
  .res-sections { padding: 20px 20px 32px; }
  .res-grid { grid-template-columns: 1fr; }
}
`.trim();

const ARTICLE_CSS = `
.article-wrap { max-width: 720px; margin: 0 auto; padding: 56px 24px 72px; }
.article-head { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid rgba(0,0,0,0.08); }
.article-head h1 {
  font-size: clamp(30px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 14px;
}
.article-lede { font-size: 18px; color: var(--slate-600); line-height: 1.6; margin-bottom: 18px; }
.article-meta { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); }

.prose { font-size: 17px; color: var(--slate-800); line-height: 1.75; }
.prose > * + * { margin-top: 22px; }
.prose h2 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.3;
  color: var(--slate-900);
  margin-top: 48px;
  margin-bottom: -4px;
}
.prose h3 {
  font-size: 19px;
  font-weight: 600;
  color: var(--slate-900);
  margin-top: 34px;
  margin-bottom: -8px;
}
.prose a { color: var(--blue); text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 1px; }
.prose a:hover { color: var(--blue-dark); }
.prose strong { font-weight: 600; color: var(--slate-900); }
.prose ul, .prose ol { padding-left: 24px; }
.prose li { margin-top: 10px; }
.prose li::marker { color: var(--slate-400); }
.prose code {
  font-family: var(--mono);
  font-size: 0.88em;
  background: var(--slate-100);
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 5px;
  padding: 2px 6px;
}
.prose pre {
  background: var(--slate-50);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 18px 20px;
  overflow-x: auto;
}
.prose pre code { background: none; border: none; padding: 0; font-size: 14px; }
.prose blockquote {
  border-left: 3px solid var(--yellow);
  background: var(--slate-50);
  border-radius: 0 12px 12px 0;
  padding: 18px 24px;
  font-size: 18px;
  color: var(--slate-900);
  font-weight: 500;
}
.prose blockquote > * + * { margin-top: 12px; }
.prose hr { border: none; border-top: 1px solid rgba(0,0,0,0.1); margin-top: 44px; }
.prose hr + p { font-size: 14px; color: var(--slate-600); font-style: italic; }
.prose table { width: 100%; border-collapse: collapse; font-size: 15px; }
.prose th, .prose td { text-align: left; padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.08); }
.prose th { font-weight: 600; color: var(--slate-900); border-bottom-color: rgba(0,0,0,0.16); }

.article-foot {
  margin-top: 56px;
  padding: 32px;
  background: var(--slate-50);
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: 16px;
  text-align: center;
}
.article-foot h2 { font-size: 21px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
.article-foot p { font-size: 15px; color: var(--slate-600); margin-bottom: 22px; }
.article-foot-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--yellow); color: var(--blue-dark);
  font-weight: 700; font-size: 15px; padding: 13px 26px;
  border-radius: 10px; text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,197,24,0.4); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--white); border: 1px solid rgba(0,0,0,0.15);
  color: var(--slate-800); font-weight: 500; font-size: 15px;
  padding: 13px 26px; border-radius: 10px; text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.btn-secondary:hover { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.25); }

@media (max-width: 768px) {
  .article-wrap { padding: 36px 20px 56px; }
  .prose { font-size: 16px; }
  .article-foot { padding: 28px 20px; }
}
`.trim();

const FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
`.trim();

const navHtml = (backHref, backLabel) => `
<nav>
  <a href="/" class="nav-logo"><img src="/trueload_logo.svg" alt="TrueLoad"></a>
  <div class="nav-right">
    <a href="${backHref}" class="nav-back">&larr; ${backLabel}</a>
    <a href="https://app.trueloadapp.com" class="nav-cta">Open TrueLoad</a>
  </div>
</nav>`.trim();

const FOOTER_HTML = `
<footer>
  <div class="footer-logo">
    <a href="/"><img src="/trueload_logo.svg" alt="TrueLoad"></a>
  </div>
  <p class="footer-disclaimer">
    TrueLoad is a service adequacy evaluation aid. This tool does not constitute engineering services, guarantee code compliance, or imply AHJ approval. Final responsibility for code compliance remains with the licensed preparer and the Authority Having Jurisdiction.
  </p>
  <div class="footer-links" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;">
    <a href="/resources/" class="footer-link">Resources</a>
    <a href="/terms/" class="footer-link">Terms of Service</a>
    <a href="/privacy/" class="footer-link">Privacy Policy</a>
    <a href="mailto:info@ethermsolutions.com" class="footer-link">info@ethermsolutions.com</a>
  </div>
</footer>`.trim();

function page({ title, description, canonical, css, jsonLd, body }) {
  return `<!DOCTYPE html>
<!--
  GENERATED FILE - do not edit by hand. Your changes will be overwritten.
  Source:  content/resources.json  +  content/guides/*.md
  Rebuild: npm run build:resources
-->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${SITE}/trueload_logo_lg.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/favicon.png" />
${FONT_LINKS}
<style>
${BASE_CSS}

${css}
</style>
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body>

${body}

</body>
</html>
`;
}

/* ------------------------------------------------------------------ *
 * Load content
 * ------------------------------------------------------------------ */

if (!fs.existsSync(CONTENT_JSON)) {
  console.error(`Missing ${path.relative(ROOT, CONTENT_JSON)}`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(CONTENT_JSON, 'utf8'));
} catch (err) {
  console.error(`content/resources.json is not valid JSON:\n  ${err.message}`);
  console.error('\nA missing comma or a stray trailing comma is the usual cause.');
  process.exit(1);
}

const categories = Array.isArray(manifest.categories) ? manifest.categories : [];
if (!categories.length) fail('content/resources.json: "categories" is empty.');

const categoryIds = new Set(categories.map((c) => c.id));
const items = [];

// --- from resources.json -------------------------------------------
for (const [i, r] of (manifest.resources || []).entries()) {
  const label = `content/resources.json -> resources[${i}]`;
  if (!r.title) { fail(`${label}: missing "title".`); continue; }
  if (!r.category) fail(`${label} ("${r.title}"): missing "category".`);
  else if (!categoryIds.has(r.category)) {
    fail(`${label} ("${r.title}"): category "${r.category}" is not defined. Known categories: ${[...categoryIds].join(', ')}`);
  }

  if (r.type === 'pdf') {
    if (!r.file) { fail(`${label} ("${r.title}"): type "pdf" needs a "file".`); continue; }
    const abs = path.join(FILES_DIR, r.file);
    if (!fs.existsSync(abs)) {
      fail(`${label} ("${r.title}"): file not found at resources/files/${r.file}`);
      continue;
    }
    items.push({
      ...r,
      href: `/resources/files/${r.file}`,
      detail: `PDF · ${formatBytes(fs.statSync(abs).size)}`,
      action: 'Download',
      external: false,
    });
  } else if (r.type === 'link') {
    if (!r.url) { fail(`${label} ("${r.title}"): type "link" needs a "url".`); continue; }
    items.push({
      ...r,
      href: r.url,
      detail: hostOf(r.url),
      action: 'Read it',
      external: true,
    });
  } else {
    fail(`${label} ("${r.title}"): type must be "pdf" or "link" (got "${r.type ?? 'nothing'}").`);
  }
}

// --- from content/guides/*.md --------------------------------------
const guides = [];
const guideFiles = fs.existsSync(GUIDES_DIR)
  ? fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md')).sort()
  : [];

for (const file of guideFiles) {
  const label = `content/guides/${file}`;
  const { data, body } = parseFrontMatter(fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8'), label);
  const slug = data.slug || slugify(file.replace(/\.md$/, ''));

  if (!data.title) fail(`${label}: front matter is missing "title".`);
  if (!data.description) fail(`${label}: front matter is missing "description".`);
  if (!data.category) fail(`${label}: front matter is missing "category".`);
  else if (!categoryIds.has(data.category)) {
    fail(`${label}: category "${data.category}" is not defined in content/resources.json. Known categories: ${[...categoryIds].join(', ')}`);
  }
  if (guides.some((g) => g.slug === slug)) fail(`${label}: duplicate slug "${slug}".`);

  const guide = { ...data, slug, body, file };
  guides.push(guide);
  items.push({
    ...data,
    type: 'guide',
    href: `/resources/guides/${slug}/`,
    detail: data.updated ? `Updated ${formatDate(data.updated)}` : '',
    action: 'Read the guide',
    external: false,
  });
}

if (problems.length) {
  console.error(`\nResource library build failed - ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  for (const p of problems) console.error(`  · ${p}`);
  console.error('');
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * Render the index
 * ------------------------------------------------------------------ */

const TYPE_LABEL = { guide: 'Guide', pdf: 'PDF', link: 'Link' };

function cardHtml(item) {
  const searchKey = [item.title, item.description, item.source].filter(Boolean).join(' ').toLowerCase();
  const linkAttrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const arrow = item.external ? ' &#8599;' : ' &rarr;';

  return `      <article class="res-card${item.featured ? ' res-card-featured' : ''}" data-category="${esc(item.category)}" data-search="${esc(searchKey)}">
        <div class="res-card-top">
          <span class="res-type res-type-${esc(item.type)}">${TYPE_LABEL[item.type]}</span>
          ${item.source ? `<span class="res-source">${esc(item.source)}</span>` : ''}
        </div>
        <h3><a href="${esc(item.href)}"${linkAttrs}>${esc(item.title)}</a></h3>
        <p>${esc(item.description)}</p>
        <div class="res-card-foot">
          <span class="res-action">${item.action}${arrow}</span>
          ${item.detail ? `<span class="res-detail">${esc(item.detail)}</span>` : ''}
        </div>
      </article>`;
}

const sortItems = (a, b) =>
  (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
  (a.order ?? 999) - (b.order ?? 999) ||
  String(a.title).localeCompare(String(b.title));

const sectionsHtml = categories
  .map((cat) => {
    const inCat = items.filter((i) => i.category === cat.id).sort(sortItems);
    if (!inCat.length) return '';
    return `  <section class="res-section" id="${esc(cat.id)}" data-category="${esc(cat.id)}">
    <div class="res-section-head">
      <h2>${esc(cat.label)}</h2>
      ${cat.blurb ? `<p>${esc(cat.blurb)}</p>` : ''}
    </div>
    <div class="res-grid">
${inCat.map(cardHtml).join('\n')}
    </div>
  </section>`;
  })
  .filter(Boolean)
  .join('\n\n');

const chipsHtml = [{ id: 'all', label: 'All' }, ...categories.map((c) => ({ id: c.id, label: c.label }))]
  .map(
    (c) =>
      `      <button type="button" class="res-chip" data-filter="${esc(c.id)}" aria-pressed="${c.id === 'all' ? 'true' : 'false'}">${esc(c.label)}</button>`,
  )
  .join('\n');

const INDEX_JS = `
(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.res-section'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.res-card'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.res-chip'));
  var empty = document.getElementById('res-empty');
  var activeFilter = 'all';
  var query = '';

  // The search box is injected rather than shipped in the HTML, so it never
  // appears as a dead input when scripting is unavailable.
  var search = document.createElement('input');
  search.type = 'search';
  search.className = 'res-search';
  search.placeholder = 'Search resources\\u2026';
  search.setAttribute('aria-label', 'Search resources');
  document.getElementById('res-controls').appendChild(search);

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var matchCat = activeFilter === 'all' || card.dataset.category === activeFilter;
      var matchText = !query || card.dataset.search.indexOf(query) !== -1;
      var visible = matchCat && matchText;
      card.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    sections.forEach(function (section) {
      var any = section.querySelectorAll('.res-card:not([style*="none"])').length > 0;
      section.style.display = any ? '' : 'none';
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeFilter = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      apply();
    });
  });

  var timer;
  search.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      query = search.value.trim().toLowerCase();
      apply();
    }, 80);
  });
})();
`.trim();

const indexBody = `${navHtml('/', 'Back to Home')}

<!-- PAGE HEADER -->
<div class="page-header">
  <div class="section-label">Resource Library</div>
  <h1>Everything worth knowing about existing load</h1>
  <p>Guides, code references, and independent research for contractors, inspectors, and homeowners working through service capacity. Free to use, no account required.</p>
</div>

<!-- FILTERS -->
<div class="res-controls" id="res-controls">
  <div class="res-filters">
${chipsHtml}
  </div>
</div>

<!-- RESOURCES -->
<div class="res-sections">
${sectionsHtml}

  <p class="res-empty" id="res-empty">No resources match that search.</p>
</div>

<!-- CTA -->
<section class="cta-section">
  <h2>Ready to run a real calculation?</h2>
  <p>Turn a year of utility interval data into an AHJ-ready 220.87 report.</p>
  <div class="cta-actions">
    <a href="https://app.trueloadapp.com" class="btn-primary">Open TrueLoad &rarr;</a>
    <a href="/plans/" class="btn-secondary">See plans &amp; pricing</a>
  </div>
</section>

${FOOTER_HTML}

<script>
${INDEX_JS}
</script>`;

const indexJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'TrueLoad Resource Library',
  description:
    'Guides, code references, and research on NEC 220.87 existing load calculations, utility interval data, and electrical panel capacity.',
  url: `${SITE}/resources/`,
  publisher: { '@type': 'Organization', name: 'eTherm Solutions LLC', url: SITE },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((item, n) => ({
      '@type': 'ListItem',
      position: n + 1,
      name: item.title,
      description: item.description,
      url: item.external ? item.href : `${SITE}${item.href}`,
    })),
  },
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, 'index.html'),
  page({
    title: 'TrueLoad | Resource Library',
    description:
      'Free guides, code references, and research on NEC 220.87 existing load calculations, getting AMI interval data from your utility, and electrical panel capacity.',
    canonical: `${SITE}/resources/`,
    css: INDEX_CSS,
    jsonLd: indexJsonLd,
    body: indexBody,
  }),
);

/* ------------------------------------------------------------------ *
 * Render each guide
 * ------------------------------------------------------------------ */

marked.setOptions({ gfm: true });

for (const guide of guides) {
  const dir = path.join(OUT_DIR, 'guides', guide.slug);
  fs.mkdirSync(dir, { recursive: true });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    url: `${SITE}/resources/guides/${guide.slug}/`,
    author: { '@type': 'Organization', name: 'TrueLoad' },
    publisher: {
      '@type': 'Organization',
      name: 'eTherm Solutions LLC',
      logo: { '@type': 'ImageObject', url: `${SITE}/trueload_logo_lg.png` },
    },
    ...(guide.updated ? { dateModified: guide.updated, datePublished: guide.updated } : {}),
  };

  const body = `${navHtml('/resources/', 'Back to Resources')}

<article class="article-wrap">
  <header class="article-head">
    <div class="section-label">TrueLoad Guide</div>
    <h1>${esc(guide.title)}</h1>
    <p class="article-lede">${esc(guide.description)}</p>
    ${guide.updated ? `<p class="article-meta">Updated ${esc(formatDate(guide.updated))}</p>` : ''}
  </header>

  <div class="prose">
${marked.parse(guide.body).trim()}
  </div>

  <div class="article-foot">
    <h2>Put it into practice</h2>
    <p>TrueLoad runs the calculation from your utility's own interval data and produces the report.</p>
    <div class="article-foot-actions">
      <a href="https://app.trueloadapp.com" class="btn-primary">Open TrueLoad &rarr;</a>
      <a href="/resources/" class="btn-secondary">More resources</a>
    </div>
  </div>
</article>

${FOOTER_HTML}`;

  fs.writeFileSync(
    path.join(dir, 'index.html'),
    page({
      title: `TrueLoad | ${guide.title}`,
      description: guide.description,
      canonical: `${SITE}/resources/guides/${guide.slug}/`,
      css: ARTICLE_CSS,
      jsonLd,
      body,
    }),
  );
}

/* ------------------------------------------------------------------ *
 * Remove pages for guides that no longer exist
 *
 * Generating is not enough. Deleting a guide from content/guides/ used to
 * leave its published page on the site - unlinked from the index, but still
 * reachable and still indexable. Two orphans went live that way on
 * 2026-08-25. Anything under resources/guides/ that the current content does
 * not account for is removed here.
 * ------------------------------------------------------------------ */

const guidesOut = path.join(OUT_DIR, 'guides');
const keep = new Set(guides.map((g) => g.slug));

if (fs.existsSync(guidesOut)) {
  for (const entry of fs.readdirSync(guidesOut, { withFileTypes: true })) {
    if (!entry.isDirectory() || keep.has(entry.name)) continue;
    const dir = path.join(guidesOut, entry.name);
    // Only ever remove a directory that looks like something this script made.
    const contents = fs.readdirSync(dir);
    if (contents.length === 1 && contents[0] === 'index.html') {
      fs.rmSync(dir, { recursive: true });
      console.log(`  removed orphaned guide page: resources/guides/${entry.name}/`);
    } else {
      console.warn(`  NOT removing resources/guides/${entry.name}/ - unexpected contents: ${contents.join(', ')}`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Sitemap
 * ------------------------------------------------------------------ */

const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'monthly' },
  { loc: `${SITE}/plans/`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${SITE}/resources/`, priority: '0.8', changefreq: 'weekly' },
  ...guides.map((g) => ({
    loc: `${SITE}/resources/guides/${g.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: g.updated || undefined,
  })),
  { loc: `${SITE}/terms/`, priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/privacy/`, priority: '0.3', changefreq: 'yearly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

/* ------------------------------------------------------------------ */

const counts = items.reduce((acc, i) => ({ ...acc, [i.type]: (acc[i.type] || 0) + 1 }), {});
console.log(
  `Resource library built: ${items.length} resources ` +
    `(${counts.guide || 0} guides, ${counts.pdf || 0} PDFs, ${counts.link || 0} links) ` +
    `across ${categories.length} categories.`,
);
console.log(`  resources/index.html`);
for (const g of guides) console.log(`  resources/guides/${g.slug}/index.html`);
console.log(`  sitemap.xml (${urls.length} URLs)`);
