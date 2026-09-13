# Tech Doc — "Devfolio" Portfolio Clone

Source: https://preview.cruip.com/devfolio/

## 1. What the original site is actually built with

Confirmed by inspecting the live DOM, network requests, and shipped assets:

| Layer | Technology | Evidence |
|---|---|---|
| Markup | Static hand-written HTML (single page, no router, no SPA framework) | One document, no `_next`/`_nuxt`/framework hydration markers, no client-side routing |
| Styling | **Tailwind CSS v4**, pre-compiled to one static `style.css` | Utility classes use v4-only syntax: `bg-linear-to-r` (renamed from `bg-gradient-to-r`), arbitrary values like `before:bg-[position:200%_0,0_0]`, v4 theme tokens (`var(--text-sm)`, `var(--spacing)`, `var(--font-weight-medium)`), `rounded-full` implemented as `calc(infinity*1px)` (a v4 idiom), custom classes defined via v4's CSS-first `@utility`/`@theme` approach (`.font-inter-tight { font-family: var(--font-inter-tight); }`, `.btn`/`.btn-sm`) |
| Fonts | Google Fonts, loaded via `@import url(fonts.googleapis.com/css2?...)` inside the compiled CSS | Two families: **Inter** (400/500/600) and **Inter Tight** (600/700) |
| Interactivity | **Alpine.js** (`js/vendors/alpinejs.min.js`, vendored/self-hosted, not CDN) | Testimonial carousel container has `x-data`, `@resize.window.debounce`, `@transitionend`, `@mouseover/@mouseout`, `@focusin/@focusout` bindings; slides get `data-state="active"` toggled by Alpine |
| One small custom script | Vanilla JS, `js/main.js` (857 bytes, no framework) | Handles the dark-mode checkbox: toggles `.dark` on `<html>`, persists to `localStorage['dark-mode']` |
| Analytics | Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`) | Optional — drop this for a personal clone unless you want Cloudflare analytics |
| Icons | Hand-authored inline SVG (no icon font/library) | Every icon is a raw `<svg>` in the markup |
| Images | Plain local `.jpg` files, relative paths (`./images/...`) | No image CDN, no `srcset`/responsive images, no lazy-loading attributes observed |
| Favicon | Static multi-format set + `site.webmanifest` | Standard modern favicon package (PNG 96×96, SVG, .ico, apple-touch-icon, manifest) |

**Net conclusion: this is a purpose-built static HTML template (a Cruip product) — Tailwind CSS v4 + Alpine.js + vanilla JS, no build-time framework (no React/Vue/Next/Nuxt), no CMS, no backend.** The "framework" is just a Tailwind build pipeline (Tailwind CLI or Vite+Tailwind) at author-time that outputs static files; nothing framework-specific ships to the browser.

## 2. Why this stack (trade-offs, for your own decision-making)

- **Static HTML + Tailwind + Alpine** is the *lightest possible* way to reproduce this exact result — no hydration cost, no JS framework runtime, fastest possible load, trivially deployable anywhere (GitHub Pages, Netlify, Vercel static, S3, literally any static host).
- Alpine.js is only pulled in for the one non-trivial interactive widget (the auto-scrolling testimonial carousel) plus could be used for the dark-mode toggle too (it currently isn't — that's plain JS). If you don't want the carousel, you can drop Alpine entirely and keep it 100% zero-JS-framework.
- Tailwind v4 is required only if you want the exact utility classes/tokens used; you could reimplement the same visual result in plain CSS or any other CSS approach — the design doc's tokens table gives you everything needed to do that independent of Tailwind.

## 3. Recommended stack to replicate it (your build)

Given the source is static and content-driven (profile info, work history, articles, projects, testimonials), pick based on how often you'll edit content and whether you want it easy to maintain vs. matching the source 1:1 with minimum moving parts:

| Option | Best if... | Stack |
|---|---|---|
| **A. Exact 1:1 replica (recommended for "I need the same website")** | You want the fastest, most faithful clone with the least risk of drift from the source | Plain HTML + Tailwind CSS v4 (CLI build) + Alpine.js (self-hosted, same as source) + vanilla JS for dark mode. No framework, no build step beyond `npx @tailwindcss/cli`. |
| B. Same look, easier to maintain content | You'll be editing your bio/experience/articles often and want data-driven sections instead of hand-edited HTML | Astro or plain Next.js (static export) + Tailwind v4, content pulled from a small JSON/Markdown data file per section (experience.json, articles.json, etc.) |
| C. No-build, zero tooling | You want to just open an HTML file and go, no npm at all | Plain HTML + Tailwind via the **Play CDN** (`<script src="cdn.tailwindcss.com">`) — simplest to stand up, but heavier at runtime and not how the source actually ships it |

**Default recommendation: Option A**, since the ask is "100% same website." It matches the source's actual architecture (so behavior — hover animations, dark mode, carousel — replicates exactly), needs no framework knowledge, and deploys as pure static files to any host (GitHub Pages / Netlify / Vercel / Cloudflare Pages).

## 4. What you'll need to set up (no code yet — just the shape of it)

1. **Build tooling**: Node + Tailwind CSS v4 CLI (or the Vite Tailwind plugin) to compile your own `style.css` from source utility classes — mirrors how the original was built.
2. **Fonts**: Google Fonts `@import` (or self-hosted `@font-face` if you want to drop the Google Fonts network dependency) for Inter + Inter Tight at the specific weights listed in the design doc.
3. **Alpine.js**: self-hosted `alpinejs.min.js` (or CDN) — only needed for the testimonial carousel.
4. **Dark mode script**: a ~15-line vanilla JS file (checkbox → toggle `.dark` class → `localStorage`).
5. **Assets**: your own avatar photo, 3 hero gallery photos, 2 tutorial thumbnails, 4 testimonial headshots, a personal monogram/logo SVG (or drop that element), and a favicon set — full list and required dimensions are in `design-doc.md` §7.
6. **Content**: your real name/bio/experience/articles/projects/testimonials — full inventory in `design-doc.md` §8.
7. **Hosting**: any static host. No server, database, or backend required — the newsletter form has no working submit handler in the source (it's a static `<form>`, no `action`), so if you want a functioning newsletter signup you'll need to wire it to a real provider (Mailchimp/Buttondown/ConvertKit/etc.) as an addition beyond the original.

## 5. Explicitly not present in the source (so you don't build things that aren't there)

- No CMS, no database, no API routes.
- No working newsletter backend (form has no action/handler).
- No contact form.
- No blog engine — "Articles" section links out to external posts (Medium, IndieHackers), it doesn't host content itself.
- No authentication, no analytics dashboard (just a passive Cloudflare beacon).
- No test suite, no CI config visible.

## 6. Next step (when you're ready to move past mapping)

Once you confirm the docs above match what you want, the implementation order would be:
1. Scaffold project + Tailwind v4 build.
2. Base layout shell (panel, header, footer) with placeholder content.
3. Build each section component per `design-doc.md` §6, in order top to bottom.
4. Wire dark mode + carousel interactivity.
5. Drop in your real content/assets.
6. Deploy to static hosting.
