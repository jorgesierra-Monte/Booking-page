# Booking Page Prototype

An interactive redesign prototype of the Grow Therapy booking page, built on the **Arc**
design system. Its purpose is to **compare color and UI treatments side-by-side** — a
floating control panel lets you switch options live so the team can decide what to ship.

> ⚠️ This is a design prototype, not production code.

**Live demo:** https://booking-page-prototype.vercel.app

---

## Run locally

```bash
npm install
npm run dev
```

Opens at **http://localhost:5185**.

**Stack:** React 19 · Vite · Tailwind CSS 3 · bundled *Season VF* variable fonts.

---

## The floating switcher

A fixed panel on the left drives everything (it's a review tool, not part of the booking UI).

| Section | What it does |
|---|---|
| **Color options** | Current · Wilson 750/850 · Frodo 400/500/600 · Filled inputs · Wilson + Frodo · Stroke + fill. Changes the selected-state fills/borders of radios, selectable buttons, day selector, and dropdown. |
| **Border weight** | Rest-state stroke width for tiles + text inputs (1 / 1.25 / 2 px). |
| **Selected border** | Stroke width of the *selected* state (1 / 1.5 / 2 px). |
| **Press scale (%)** | How far buttons scale down while pressed (0.7 / 1 / 1.5 / 3). |
| **Device** | Desktop vs. mobile preview. |

- Family groups **collapse** via the chevron next to each header (the active option's group auto-expands).
- Every setting persists in `localStorage` and carries into the mobile preview.

Switching a color option **resets the form to its default state** so each option is compared fresh.

---

## How theming works

Each color option is a `data-theme` attribute set on `<html>` that overrides a set of
**CSS custom properties** declared in [`src/index.css`](src/index.css). Both Tailwind
utility classes and CSS-module styles resolve to those variables, so a theme swap
re-skins every component with no per-component changes.

Key token groups (see the `:root` block in `index.css`):

- `--select-tile-surface-selected` / `--select-tile-text-selected` / `--select-border-selected` — radio + selectable + time-slot selected state
- `--tile-surface` / `--tile-surface-hover` / `--tile-border` — tile rest/hover
- `--field-surface*` / `--field-border*` — text input & select states
- `--day-*`, `--dropdown-row-*` — day selector & dropdown rows
- `--stroke-weight`, `--stroke-weight-selected`, `--press-scale`, `--press-duration` — driven by the switcher controls

### Adding a new color option

1. Add a `:root[data-theme="myOption"] { … }` block in `src/index.css` overriding the tokens you want.
2. Add an entry to the `FAMILIES` array in [`src/booking/ColorSwitcher.jsx`](src/booking/ColorSwitcher.jsx):
   ```js
   { label: 'My Option', theme: 'myOption' }
   ```

That's it — the switcher pill and live swap are wired automatically.

---

## Mobile preview

Selecting **Device → Mobile** renders the app inside a phone-framed `<iframe src="?embed=1">`
at a true 390px viewport, so the real `sm:` breakpoints resolve to mobile (not just a
squished container). `?embed=1` hides the switcher inside the frame, and the iframe shares
`localStorage` with the parent so it inherits the current theme + settings.

---

## Project map

| Path | Role |
|---|---|
| `src/booking/BookingPage.jsx` | App shell — owns flow state + all switcher settings (theme/stroke/press/device) |
| `src/booking/ColorSwitcher.jsx` | The floating control panel |
| `src/booking/ui.jsx` | Arc primitives (Button, TextField, SelectField, RadioTiles, SelectableGroup, …) |
| `src/booking/sections.jsx` | The four booking steps |
| `src/components/Calendar.jsx` · `TimeSlots.jsx` | Day selector + time slots |
| `src/index.css` | Design tokens + all `[data-theme]` override blocks |
| `tailwind.config.js` | Arc spacing/typography scale, color → CSS-var bridge |

**Note on dead code:** `src/App.jsx` (an earlier default-flow version) and some `*.module.css`
files are unused. The live app is `src/booking/BookingPage.jsx`, rendered from `src/main.jsx`.

---

## Deploy

Production deploys to Vercel:

```bash
npx vercel@latest --prod --yes --scope grow-therapy-dbd34edb
```

This aliases to **booking-page-prototype.vercel.app**.
