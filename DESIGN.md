# Design System

## Overview

Light theme with warm stone neutrals and a deep forest-green accent. Editorial layout with strong typographic hierarchy and varied section rhythms. Built for a single-page fintech landing demo.

## Colors

### Neutral scale (warm stone, tinted toward orange, chroma 0.01)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `oklch(98% 0.01 55)` | Page background |
| `--bg-secondary` | `oklch(94% 0.01 55)` | Section alternates, subtle fills |
| `--bg-tertiary` | `oklch(88% 0.01 55)` | Borders, dividers, subtle backgrounds |
| `--text-primary` | `oklch(25% 0.02 55)` | Headings, body text |
| `--text-secondary` | `oklch(50% 0.02 55)` | Captions, meta text |
| `--text-tertiary` | `oklch(65% 0.02 55)` | Placeholders, disabled |

### Accent (deep forest green, OKLCH hue 145)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `oklch(55% 0.15 145)` | Primary buttons, links, focus rings |
| `--accent-hover` | `oklch(48% 0.15 145)` | Button hover |
| `--accent-subtle` | `oklch(95% 0.04 145)` | Tinted backgrounds, badges |

### Functional

| Token | Value | Usage |
|---|---|---|
| `--border` | `oklch(85% 0.01 55)` | Subtle borders |
| `--border-strong` | `oklch(70% 0.01 55)` | Visible dividers |
| `--overlay` | `oklch(15% 0.02 55 / 0.5)` | Modal backdrops |

## Typography

### Font families

- **Display / Headings**: `Newsreader, Georgia, serif` — editorial, confident
- **Body / UI**: `Inter, system-ui, sans-serif` — clean, readable

### Type scale (1.25 ratio, base 16px)

| Token | Size | Weight | Line-height | Family | Usage |
|---|---|---|---|---|---|
| `text-hero` | `clamp(2.5rem, 5vw, 4rem)` | 400 | 1.1 | Display | Hero headline |
| `text-h1` | `clamp(2rem, 4vw, 3rem)` | 400 | 1.15 | Display | Section headings |
| `text-h2` | `1.5rem` | 500 | 1.3 | Body | Subsection headings |
| `text-h3` | `1.25rem` | 500 | 1.4 | Body | Card titles |
| `text-body` | `1rem` | 400 | 1.6 | Body | Paragraphs |
| `text-body-sm` | `0.875rem` | 400 | 1.5 | Body | Captions, meta |
| `text-ui` | `0.875rem` | 500 | 1.4 | Body | Buttons, labels, nav |

### Body line length

Max `70ch` for paragraphs.

## Spacing

Use a 4px base grid. Vary spacing per section for rhythm:

| Token | Value |
|---|---|
| `space-xs` | `0.5rem` |
| `space-sm` | `1rem` |
| `space-md` | `2rem` |
| `space-lg` | `4rem` |
| `space-xl` | `6rem` |
| `space-2xl` | `8rem` |

Sections alternate between `space-2xl` and `space-xl` padding to create visual rhythm. Not all sections use the same padding.

## Layout

- Max content width: `1200px`
- Horizontal padding: `clamp(1.5rem, 5vw, 4rem)`
- Hero: asymmetric two-column on desktop (55/45), stacked on mobile
- Features: full-width with internal max-width, not card grid
- Social proof: single-column centered with generous whitespace
- CTA: centered, compact

## Components

### Buttons

**Primary**
- Background: `--accent`
- Text: `oklch(98% 0.01 55)`
- Padding: `0.75rem 1.5rem`
- Border-radius: `0.25rem`
- Font: `text-ui`
- Hover: background `--accent-hover`, transition `background 200ms ease-out`

**Secondary**
- Background: transparent
- Border: `1px solid --border-strong`
- Text: `--text-primary`
- Hover: background `--bg-secondary`

### Navigation

- Fixed top, background `--bg-primary` with `backdrop-filter: blur(8px)`
- Logo left, links center (hidden on mobile), CTA button right
- Links: `text-ui`, color `--text-secondary`, hover `--text-primary`
- Mobile: hamburger menu

## Motion

- Default easing: `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart)
- Transition duration: `200ms` for UI, `400ms` for reveals
- Respect `prefers-reduced-motion: reduce`
- No animation on layout properties (width, height, top, left)
- Use `transform` and `opacity` only

## Elevation

No shadows on cards. Use borders (`--border`) and background tints (`--bg-secondary`) for depth. Only exception: subtle `box-shadow` on the fixed nav for separation.
