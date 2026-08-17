// Floating color-option switcher — a dev/review control for comparing selected-state
// color treatments (radio, selectable, day selector, dropdown) side by side.
// Controlled: the parent owns the active theme (applies the `data-theme` attribute,
// persists it, and resets the form on change). Token overrides live in index.css.
// Chrome matches the Figma "floating nav" (node 2646-4896) and uses tokens NOT touched
// by any theme block, so it never restyles itself.
// Desktop: compact card, always visible. Mobile: collapses to a launcher pill.
import { useEffect, useState } from 'react'

const cx = (...c) => c.filter(Boolean).join(' ')

// Border-weight control (independent of the color option). Drives --stroke-weight,
// used by radio/selectable/day/text-input borders. Applied live (no form reset).
const STROKE_KEY = 'booking-stroke-weight'
const STROKE_OPTIONS = [
  { label: '1', value: '1px' },
  { label: '1.25', value: '1.25px' },
  { label: '2', value: '2px' },
]
const applyStroke = v => document.documentElement.style.setProperty('--stroke-weight', v)

// Families → options. `theme: null` is the untouched prototype ("Current").
// Add a new option here + one [data-theme] block in index.css to extend.
const FAMILIES = [
  { header: null, options: [{ label: 'Current', theme: null }] },
  {
    header: 'Wilson',
    options: [
      { label: 'Wilson 750', theme: 'wilson750' },
      { label: 'Wilson 850', theme: 'wilson850' },
    ],
  },
  {
    header: 'Frodo',
    options: [
      { label: 'Frodo 400', theme: 'frodo400' },
      { label: 'Frodo 500', theme: 'frodo500' },
      { label: 'Frodo 600', theme: 'frodo600' },
    ],
  },
  {
    header: 'Filled inputs',
    options: [
      { label: 'Frodo 400', theme: 'frodo400filled' },
      { label: 'Frodo 500', theme: 'frodo500filled' },
    ],
  },
]

export function ColorSwitcher({ active = null, onSelect }) {
  // Start collapsed only on small screens; desktop always shows the card.
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 639px)').matches,
  )

  const [stroke, setStroke] = useState(
    () => (typeof window === 'undefined' ? '1px' : localStorage.getItem(STROKE_KEY) || '1px'),
  )
  useEffect(() => {
    applyStroke(stroke)
  }, [])
  const selectStroke = value => {
    setStroke(value)
    applyStroke(value)
    localStorage.setItem(STROKE_KEY, value)
  }

  return (
    <>
      {/* Mobile-only collapsed launcher (never shown on desktop). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open color options"
        className={cx(
          'fixed left-4 top-1/2 z-[60] min-h-[38px] -translate-y-1/2 items-center gap-100 rounded-rounded border border-border-subtle bg-surface-default px-200 typography-label-emphasis-xsmall text-text-default shadow-[0_4px_16px_rgba(1,2,4,0.08)] sm:hidden',
          open ? 'hidden' : 'flex',
        )}
      >
        <span className="inline-block h-3 w-3 rounded-rounded bg-action-primary-surface" />
        Colors
      </button>

      {/* Card — always visible on desktop; on mobile only when open. */}
      <div
        className={cx(
          'fixed left-4 top-1/2 z-[60] w-[131px] -translate-y-1/2 flex-col gap-450 rounded-medium border border-border-subtle bg-surface-default px-[13px] py-[21px] shadow-[0_4px_16px_rgba(1,2,4,0.08)] sm:flex',
          open ? 'flex' : 'hidden',
        )}
        role="group"
        aria-label="Color option"
      >
        {/* Collapse control — mobile only (desktop card stays open). */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse color options"
          className="absolute right-150 top-150 flex h-5 w-5 items-center justify-center rounded-rounded text-text-muted transition-colors hover:bg-surface-subtle sm:hidden"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {FAMILIES.map((family, fi) => (
          <div key={family.header ?? `group-${fi}`} className="flex flex-col gap-150">
            {family.header && (
              <span className="text-center typography-label-emphasis-xsmall text-text-muted">
                {family.header}
              </span>
            )}
            {family.options.map(opt => {
              const isActive = active === opt.theme
              return (
                <button
                  key={opt.label}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelect?.(opt.theme)}
                  className={cx(
                    'flex h-[38px] items-center justify-center whitespace-nowrap rounded-rounded px-150 typography-label-small transition-colors',
                    isActive
                      ? 'bg-action-primary-surface text-text-inverse'
                      : 'bg-surface-subtle text-text-default hover:bg-surface-hover-emphasis',
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        ))}

        {/* Border weight — segmented toggle (1 / 1.5 / 2 px). */}
        <div className="flex flex-col gap-150">
          <span className="text-center typography-label-emphasis-xsmall text-text-muted">
            Border weight
          </span>
          <div
            className="flex gap-[2px] rounded-rounded bg-surface-subtle p-[3px]"
            role="group"
            aria-label="Border weight"
          >
            {STROKE_OPTIONS.map(o => {
              const on = stroke === o.value
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => selectStroke(o.value)}
                  className={cx(
                    'flex h-[30px] flex-1 items-center justify-center rounded-rounded typography-label-small transition-colors',
                    on ? 'bg-action-primary-surface text-text-inverse' : 'text-text-default hover:bg-surface-hover-emphasis',
                  )}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
