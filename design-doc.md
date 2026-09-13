# Design Doc — "Devfolio" Portfolio Clone

Source: https://preview.cruip.com/devfolio/ (Cruip HTML template, product name "Devfolio")

This doc maps every visual/design decision on the source site so it can be rebuilt pixel-for-pixel. No code here — structure, tokens, and component specs only.

---

## 1. Overall Layout

Single-column "link-in-bio" style personal site, centered, max content width **728px**.

```
<body>
  full-bleed wrapper (overflow-hidden, clips rotated-hover elements from creating scrollbars)
    └─ column (max-width: 728px, centered)
        └─ "sheet" panel (bg white / dark:gray-900, thin left+right border, no top/bottom border)
            └─ responsive gutter (padding-inline: 12px mobile → 64px at md breakpoint)
                └─ flex column, min-height: 100vh
                    ├─ HEADER (hero, text-center, padding-top 24px)
                    ├─ MAIN (padding-block 48px, 48px vertical gap between the 6 sections below)
                    │   1. Experience
                    │   2. Tutorials
                    │   3. Articles
                    │   4. Side Hustles
                    │   5. Recommendations
                    │   6. Let's Connect (newsletter)
                    └─ FOOTER (text-center, padding-bottom 64px, 48px internal vertical gap)
```

Key visual effect: because the "sheet" panel only has **left/right** borders and the page background (gray-50 / dark:gray-900... actually a hair darker than the panel) shows above/below, on wide viewports the whole site reads as a tall vertical card floating on a soft gray canvas.

**Breakpoints used:** `min-[580px]:` (custom arbitrary breakpoint, 2-col grids), `md:` (640px+ container padding jump). No `lg`/`xl` layout changes — this is designed to look identical on tablet and desktop; it never goes wider than 728px.

---

## 2. Typography

Two Google Fonts, loaded together via one `@import url(fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@600;700...)`:

| Role | Font | Weights actually used | CSS var |
|---|---|---|---|
| Body text, paragraphs, labels, nav | **Inter** | 400 (regular), 500 (medium), 600 (semibold) | default `font-family` |
| Headings (h1, h2, "name", section titles) | **Inter Tight** | 600 (semibold), 700 (bold) | custom utility class `.font-inter-tight` |

Fallback stack: `sans-serif` after each.

### Type scale (as used, not a full scale — just what appears)
| Element | Size | Weight | Font | Color (light / dark) |
|---|---|---|---|---|
| H1 — name ("Jordan Walker") | 24px (`text-2xl`) | 700 bold | Inter Tight | gray-800 / gray-100 |
| Tagline under name | 14px (`text-sm`) | 400 | Inter | gray-600 / gray-400 |
| H2 — section titles ("Experience", "Tutorials", etc.) | 18px (`text-lg`) | 600 semibold | Inter Tight | gray-800 / gray-100 |
| Card title (job title, article title, project name) | 16px base | 600 semibold | Inter | gray-800 / gray-100 |
| Card body / description | 14px (`text-sm`) | 400 | Inter | gray-600 / gray-400 |
| Meta text (dates, location) | 13px (`text-[13px]`) | 400 italic (dates) / 500 medium (location) | Inter | gray-500/70 (dates), gray-600/gray-400 (location) |
| Testimonial name | 14px | 600 semibold | Inter | gray-800 / gray-100 |
| Testimonial role | 13px | 400 | Inter | gray-500 |
| Button label | 14px | 500 medium | Inter | contextual (see buttons) |
| Copyright | 14px | 400 | Inter | gray-400 |

---

## 3. Color System

Built entirely on **Tailwind's default neutral "gray" scale** (oklch-based) plus one dark/light-aware near-white/near-black pair for surfaces. There is **no custom brand color** — accent color only shows up as decorative per-logo SVG fills (see §7).

| Token | Light mode | Dark mode | Used for |
|---|---|---|---|
| Page canvas | gray-50 (`oklch(0.985 .002 247.8)`) | gray-900 (`oklch(0.21 .034 264.7)`) | `<body>` background, visible as the strip outside the 728px panel |
| Panel / card surface | white | gray-900 | main content sheet background |
| Sunken card surface (zebra stripe, newsletter box) | gradient gray-100 → gray-50 | gradient gray-800 → gray-800/65% | odd Experience/Article rows, Side Hustle cards, newsletter box |
| Primary text | gray-800 | gray-100 | headings |
| Secondary text | gray-600 | gray-400 | body copy, taglines |
| Tertiary / meta text | gray-400 / gray-500 | gray-500 / gray-600 | dates, copyright, placeholder text |
| Borders | gray-100 / gray-200 | gray-800 / gray-600 at 65% opacity | panel side-borders, icon-avatar borders |
| Inverted "solid" button (Available/Join Newsletter) | gradient gray-800 → gray-700, text gray-200 | gradient gray-300 → gray-100, text gray-800 | primary buttons/badges |

All colors are applied as **light/dark pairs on every element** (Tailwind `dark:` variant) — dark mode is a first-class, fully designed second theme, not an auto-invert.

---

## 4. Dark Mode Mechanism

- A single checkbox input (`#light-switch`, visually a sun/moon SVG icon toggle, top-right of the hero) drives it.
- Toggling adds/removes the class **`dark`** on `<html>`.
- Preference is persisted to `localStorage` key **`dark-mode`** (`"true"`/`"false"`) and re-applied on load — no flash-prevention inline script was detected beyond that, so a brief FOUC is possible on slow loads (acceptable to replicate as-is, or improve with a blocking head script).
- Icon swap uses Tailwind `dark:hidden` / `hidden dark:block` pairs, not JS-driven icon swap.

---

## 5. Spacing, Radius, Shadow, Motion Tokens

| Token | Value | Where |
|---|---|---|
| Section gap | 48px (`space-y-12`) | between the 6 main sections, and inside footer |
| Card list gap | 4px (`space-y-1`) | Experience/Article stacked cards (cards touch almost edge-to-edge) |
| Grid gap | 16px (`gap-4`) | Tutorials 2-col grid, Side Hustles 2-col grid |
| Card padding | 20px (`p-5`) | all card types |
| Container gutter | 12px → 64px at `md:` | outer page padding |
| Radius — cards | 12px (`rounded-xl`) | all cards, images |
| Radius — buttons/badges/avatars | full pill (`calc(infinity*1px)`, i.e. `rounded-full`) | buttons, avatar, icon circles |
| Shadow — small | `shadow-xs` | icon-avatar circles, social icons |
| Shadow — medium | `shadow-sm` | primary buttons |
| Shadow — large | `shadow-lg` | header gallery photos, avatar, tutorial video cards |
| Icon avatar size | 40×40px | Experience company-logo circle |
| Social icon size | 32×32px | footer X/GitHub/Facebook circles |
| Profile avatar size | 48×48px | hero |
| Header gallery photo | 245×160px | hero 3-photo strip |

**Motion**
- Custom bounce easing `cubic-bezier(.5,.85,.25,1.8)`, 300ms — used every time a rotated element "un-rotates" on hover.
- Primary-button shimmer: a diagonal 45° white gradient sweeps across the button on hover (`background-position` transition, 1.5s) — a light "shine" effect, more visible/opaque in dark mode.
- External-link arrow icons on Article/Side-Hustle cards rotate 45° on hover.
- Testimonial carousel auto-scrolls continuously and pauses on hover/focus (drag/swipe also supported).

---

## 6. Section-by-Section Component Spec

### 6.1 Header / Hero
- Top-right: dark/light mode toggle (sun/moon icon button).
- Centered avatar photo, 48px, circular, shadow-lg.
- H1 name.
- One-line tagline including a trailing emoji flag (e.g. 🇺🇸).
- "Available For Work" pill badge/button — dark gradient pill in light mode, light gradient pill in dark mode, with the diagonal shimmer-sweep hover effect. Acts as a status indicator (could link to contact/CV).
- **3-photo strip** below the badge: three landscape photos (245×160, rounded-xl, shadow-lg), alternating a slight ±2° rotation (`odd:-rotate-2 even:rotate-2`), all straightening to 0° together on group-hover — gives a "photos scattered on a desk" feel that tidies up on interaction.

### 6.2 Experience (timeline/work history)
- H2 "Experience".
- Stacked list of entries (4px gap), each entry:
  - Zebra-striped background: odd entries get a subtle gray gradient card background; even entries are transparent (sit directly on panel bg).
  - Left: 40px circular icon avatar (white/dark bg, bordered) containing a small colored company-logo SVG.
  - Right: italic date range (e.g. "2021 - Today"), bold linked job title, location line, 1–2 sentence description.
- Sample content: 3 entries (Qonto, Medium Inc., Vimeo) — replace with real history.

### 6.3 Tutorials
- H2 "Tutorials".
- 2-column grid (1 column under 580px) of **video-style cards**: full-bleed thumbnail image, dark gradient overlay from bottom, white title text pinned to bottom-left of the card. Same alternating-rotation/straighten-on-group-hover treatment as the hero photos.
- Entire card is a clickable link.

### 6.4 Articles
- H2 "Articles".
- Stacked list (same zebra-stripe card style as Experience), each card:
  - Small "domain" label (e.g. "medium.com") above the title.
  - Bold article title.
  - 1–2 sentence excerpt.
  - Top-right corner: small external-link arrow icon that rotates 45° and darkens on hover.
- Sample content: 3 article cards.

### 6.5 Side Hustles (side projects)
- H2 "Side Hustles".
- 2-column grid (1 column under 580px), same card chrome as Articles (icon instead of domain label): 40px rounded icon-avatar with brand-colored logo mark, bold project name, one-line description, external-link corner icon.
- Sample content: 2 project cards.

### 6.6 Recommendations (testimonials)
- H2 "Recommendations".
- **Horizontally auto-scrolling carousel** (not a static grid) — cards are ~66.7% of container width so 1.x cards are visible at once, encouraging the eye to notice more content off-screen.
- Left/right edges fade to transparent via CSS mask-image (stronger fade on mobile, a "notch" gap fade on desktop) so the scroll affordance reads as continuous.
- Each testimonial card: circular avatar (photo), name (bold), role/company (muted, smaller), quote text in quotation marks, medium-weight.
- Auto-plays/scrolls; pauses on hover, mouse-out resumes; also pauses on keyboard focus for accessibility; responds to window resize.
- Sample content: 4 testimonials.

### 6.7 Let's Connect (newsletter signup)
- H2 "Let's Connect".
- One card (sunken gray gradient bg, rounded-xl, padded): a horizontal form — email input (transparent bg, no visible border until focus, then a 2px focus ring) + solid pill "Join Newsletter" button (same dark/light gradient + shimmer as the hero badge) inline to its right.
- No visible labels; placeholder text + an `aria-label` for accessibility.

### 6.8 Footer
- Large decorative **monogram/signature SVG logo** (owner's initials, hand-drawn signature style, ~200×93, single-color fill matching heading text color) — this is a personal-brand mark, would be replaced with the new owner's own initials/signature.
- Row of 3 circular social icon buttons (32px, bordered, shadow-xs): X/Twitter, GitHub, Facebook — swap for whichever platforms the new owner actually uses.
- Small centered copyright line.

---

## 7. Iconography & Imagery

- **Icons**: all inline SVG, hand-drawn/custom (not an icon font or a library like Heroicons/Font Awesome) — sun/moon toggle, external-link arrow, social glyphs (X, GitHub, Facebook), and small brand-style logo marks used as decorative company/project icons (each in its own accent color, e.g. purple `#9C76EC`, blue `#00ADEF`, orange `#FF6E1C`, green `#17CF97`/`#0D9F73`). These are purely decorative placeholders standing in for real employer/client logos — replace with actual logos or generic icon substitutes.
- **Photos needed** (all local files in the original, referenced by relative path):
  - `user-image.jpg` — profile avatar, square, ~96px+ source.
  - `header-image-01.jpg`, `-02.jpg`, `-03.jpg` — hero gallery, landscape ~245×160 min.
  - `tutorial-01.jpg`, `-02.jpg` — tutorial thumbnails, landscape ~600×338.
  - `testimonial-01.jpg` … `-04.jpg` — square headshots for the carousel.
- **Favicon set**: 96×96 PNG, SVG, classic .ico, apple-touch-icon 180×180, plus a `site.webmanifest`.

---

## 8. Content Inventory (copy to replace with the new owner's real info)

- Name, one-line tagline, availability status.
- 3 hero gallery photo captions (alt text only, e.g. "Header 01").
- Experience: N entries × {date range, job title, company, location, description}.
- Tutorials: N entries × {thumbnail, title, link}.
- Articles: N entries × {source domain, title, excerpt, link}.
- Side Hustles: N entries × {icon, project name, description, link}.
- Recommendations: N entries × {avatar, name, role/company, quote}.
- Newsletter form copy + submit label.
- Footer: signature/monogram mark, social links, copyright name.

---

## 9. What NOT to change if the goal is a faithful clone
- 728px max content width and the "bordered sheet on gray canvas" panel treatment.
- The two-font pairing (Inter for body/UI, Inter Tight for headings) and the weight usage above.
- The zebra-stripe card treatment on stacked lists (Experience/Articles).
- The rotate-then-straighten hover motion on grouped photos/cards.
- The dark-mode-as-equal-citizen approach (every color has an explicit dark pair, toggle persisted in localStorage).
