# AI Coding Rules — billero.web

When AI modifies code in this repository it MUST follow these rules.

---

## Golden rule

READ existing files before modifying them.
Only change what the task requires. Leave everything else untouched.
Never rewrite an entire file unless explicitly asked.

---

## Protected files

These files must NOT be replaced or rewritten from scratch:

- index.html
- privacy-policy.html

---

## HTML standards

- Semantic HTML5 (header, nav, main, section, footer)
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text on all images
- Accessible: proper ARIA labels, keyboard navigation
- SEO: meta description, og tags, structured data

---

## CSS standards

- Mobile-first responsive design
- Consistent with existing color scheme and typography
- Use CSS variables where defined
- Avoid inline styles
- Media queries for breakpoints

---

## JavaScript

- Minimal, only when necessary
- No heavy frameworks (vanilla JS)
- Progressive enhancement

---

## Localization

- Slovenian is primary language (root)
- English versions in /en/ directory
- Keep translations in sync

---

## Thinking approach

Before writing code, think from three perspectives:

**As an architect:**
- Does it fit the existing site structure and style?
- Is the solution maintainable?

**As a visitor (on mobile or desktop):**
- Is the page fast to load?
- Is the content clear and readable?
- Are CTAs visible and compelling?

**As a developer:**
- Is the code clean and semantic?
- Does it follow existing conventions?

---

## Changelog — ALWAYS log changes

After completing code changes, ALWAYS append a summary to ai/changelog.md.
Format: date, task description, changed files.

---

## Documentation — ALWAYS update

When making changes, ALWAYS update related documentation:

- **ai/context.md** — if project structure changes
- **.cursorrules** — if project conventions change

This is mandatory, not optional.

---

## Stability

Do not break existing pages.
Preserve all existing styles and scripts unless removing dead code.
Test on mobile and desktop after changes.
