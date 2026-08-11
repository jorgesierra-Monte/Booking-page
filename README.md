# Booking page prototype

Interactive prototype of Grow's redesigned booking page, built from the
[Design explorations Figma file](https://www.figma.com/design/43eLqdcDzNO37QNp4YhmMa/Design-explorations?node-id=2580-32698).

Vite + React. Uses the OS-installed **Season VF / Season Sans** brand fonts.

## Run

```bash
npm install
npm run dev
```

## What's here

Full, pixel-faithful booking page with every interaction state:

- **Text inputs & select** — reused verbatim from the `text-input-outlined`
  prototype (float-on-focus label, masked phone/date, custom select dropdown).
  Motion default: 160ms, entrance easing `cubic-bezier(0,0,0.38,0.9)`.
- **Checkbox** (`BETA Checkbox V2`) — default / hover / checked / focus.
- **Radio cards** (`BETA Radio Button V2`) — default / hover / selected, used for
  appointment type (Virtual / In person) and billing (Insurance / Cash).
- **Calendar** — real month navigation, selectable dates, disabled past days.
- **Time-slot selector** — selectable slots; drives the sticky-footer summary.
- Page chrome: nav, provider header, promo banners, section subheads, sticky
  footer with a live booking summary + Book session button.

## Component source of truth

The reused input/select components live at the repo root (`src/InputField.jsx`,
`src/MaskedInputField.jsx`, `src/SelectField.jsx`) with the only change being
fluid width (`100%`) so they fill the two-column layout. New components are in
`src/components/`.
