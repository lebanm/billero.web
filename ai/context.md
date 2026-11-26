# AI Context — billero.web

This file is read by AI tools and provides context for code generation.

---

## Project

billero.web is the marketing/landing website for the billero.app mobile invoicing app.
Static website: HTML, CSS, JavaScript (no framework), with a small Cloudflare
edge Worker for entry-language selection and legacy URL redirects (WEB-008).
Localized homepages: `/sl/`, `/en/`, `/de/`, `/es/`, `/nl/`, `/th/`.
`/` is the x-default entry: saved `lang` cookie, then Accept-Language, then English.
Legal/help pages and release notes have 12 language variants. Existing localized
URLs stay in place. W8-4 sends absent homepages to `/` for language negotiation;
absent contact/donate pages fall back to English. The inventory removes each
fallback when its translation is added.
Country invoice guides (WEB-009) cover Slovenia (sl/en), the US (en/es) and
Germany (de/en). Their language alternatives stay within the same market.
The standalone `/app` download page (WEB-010) chooses the store on mobile and
shows both links on desktop. Its assets are entirely inside `app/`; it does not
depend on the Worker, shared language scripts, cookies or external scripts.
Campaign `c` is allowlisted in `app/store-links.js`; language `l` defaults to es.

Target audience: sole proprietors and one-person businesses (including single-owner LLCs).
Goal: explain the app, drive downloads, build trust.

---

## Project structure

```
billero.web/
  index.html              — neutral language entry, static-browser fallback
  app/                    — standalone noindex download page and store-link source
  sl/                     — Slovenian canonical pages (extensionless URLs)
  en/                     — English versions of pages
  de/, es/                — German and Spanish homepages and legal/help pages
  nl/                     — Dutch homepage and legal pages
  th/                     — Thai homepage and legal pages
  css/                    — stylesheets
    landing.css           — scoped styles for the localized landing pages
    invoice-guide.css     — reading layout and responsive country-guide tables
  js/                     — scripts
    landing.js            — mobile navigation and progressive map enhancement
    language.js           — explicit language-choice cookie
    language-entry.js     — generated static entry fallback
  img/                    — images, icons, screenshots
    web008/               — web cards from store screenshots and localized OG images
  edge/                   — language-router.mjs, generated routes, wrangler.jsonc
  scripts/                — locale inventory, local preview and validation
    invoice-guides.json   — reviewed guide content, official sources and FAQs
    build-invoice-guides.py — static HTML + identical FAQPage JSON-LD
  tests/                  — language routing regression cases
  llms.txt                — factual 1.8.1 product summary
  sitemap.xml             — canonical URLs and reciprocal language alternatives
  ai/                     — AI context and rules
```

---

## Protected files

These files are critical website infrastructure. Never rewrite from scratch:

- index.html
- privacy-policy.html

## Cross-repository Codex ↔ Claude collaboration

The mobile app is in `C:\Users\matej\git\billero.app`. Shared task state,
review messages and the product-claim contract live only in
`C:\Users\matej\git\billero.app\docs\ai`. Before editing this website, Codex
and Claude must read root `AGENTS.md` and that shared `current-task.md`.

---

## Development philosophy

Keep the website: fast, simple, mobile-friendly.
Semantic HTML5, minimal JavaScript.
Responsive design (mobile-first).
Respect existing visual style and structure.

WEB-008 remains a local preparation for 1.8.1 until review and explicit publication
authorization. See `ai/WEB-008-hosting.md`; the existing FTP script does not publish
the Worker and must not upload the new development directories. Root legacy HTML
files are retained as compatibility sources; the Worker returns their 301 targets.
After adding a page, run `python scripts/sync-locales.py` and `npm run check:site`.
Exception: `/app` is deliberately outside the locale inventory and sitemap.
After changing homepage store links or the campaign source, run
`node scripts/update-store-links.mjs`; en/es get website attribution, other
homepages use country-neutral untagged links. JSON-LD download URLs stay untagged.
Use `node scripts/preview.mjs 8789 --static` and `node scripts/check-download.mjs`
to check `/app` without the Worker. This page can be uploaded separately after
review and explicit authorization; upload only its five files, not all local HTML.
See `billero.app/docs/strategy/evidence/WEB-010/README.md` for the exact list,
live HTTP observations and post-upload checks. Browser emulation cannot prove
real in-app store handoff; visible links are the fallback. Without JavaScript,
the static page is Spanish and both links use campaign `web`.

For country guides, edit `scripts/invoice-guides.json`, then run
`python scripts/build-invoice-guides.py` before `sync-locales.py`. The explicit
country identifier groups translated and nested paths. Verify legal claims
against official sources; app legal data alone is not authoritative. Check the
two special limits: no SI fiscal confirmation and no DE structured E-Rechnung.
Use `check-invoice-guides.mjs`, `audit-invoice-guides.mjs` and
`validate-schema.mjs <evidence-dir> --compact <page.html> ...` for compact QA.
WEB-009 publication follows WEB-008 and needs separate explicit authorization.
