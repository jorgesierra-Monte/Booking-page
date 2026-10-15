// Floating design switcher — a dev/review control with two tiers:
//   1. "Current design" — the SHIPPED decision (the base styling, applied when no
//      theme is set) plus the spec knobs that are part of it: border weight,
//      selected-border weight, and press scale.
//   2. "Explore" — a collapsed drawer of the explorations that led here: the earlier
//      "Original" baseline plus the Wilson/Frodo color studies.
// Device (desktop/mobile) is a preview utility pinned at the bottom.
// Fully controlled: BookingPage owns theme / stroke / press / device, persists them,
// and applies theme + stroke to the document (so an embedded preview iframe picks
// them up too). Chrome uses tokens NOT touched by any theme, so it never restyles.
import { useState } from 'react'

const cx = (...c) => c.filter(Boolean).join(' ')

const STROKE_OPTIONS = [
  { label: '1', value: '1px' },
  { label: '1.25', value: '1.25px' },
  { label: '2', value: '2px' },
]
const SELECTED_STROKE_OPTIONS = [
  { label: '1', value: '1px' },
  { label: '1.5', value: '1.5px' },
  { label: '2', value: '2px' },
]
const PRESS_SCALE_OPTIONS = [
  { label: '0.7', value: '0.993' },
  { label: '1', value: '0.99' },
  { label: '1.5', value: '0.985' },
  { label: '3', value: '0.97' },
]

const DesktopIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" />
    <path d="M7 16.5h6M10 13.5v3" strokeLinecap="round" />
  </svg>
)
const MobileIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="6" y="2.5" width="8" height="15" rx="2" />
    <path d="M9 15h2" strokeLinecap="round" />
  </svg>
)
const DEVICE_OPTIONS = [
  { value: 'desktop', label: 'Desktop', Icon: DesktopIcon },
  { value: 'mobile', label: 'Mobile', Icon: MobileIcon },
]

// Explorations that led to the shipped design. The shipped design IS the base (no
// data-theme); "Original" restores the earlier Wilson/Frodo baseline.
// `header: null` renders a single always-visible pill with no collapse toggle.
const EXPLORE_FAMILIES = [
  { header: null, options: [{ label: 'Original', theme: 'original' }] },
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
  {
    header: 'Wilson + Frodo',
    options: [
      { label: 'Frodo 400', theme: 'frodo400wilson' },
      { label: 'Frodo 500', theme: 'frodo500wilson' },
    ],
  },
  {
    header: 'Stroke + fill',
    options: [
      { label: 'Wilson 750', theme: 'wilson750sf' },
      { label: 'Wilson 850', theme: 'wilson850sf' },
      { label: 'Frodo 400', theme: 'frodo400sf' },
      { label: 'Frodo 500', theme: 'frodo500sf' },
      { label: 'Frodo 600', theme: 'frodo600sf' },
    ],
  },
]

const segItem = on =>
  cx(
    'flex size-[32px] shrink-0 items-center justify-center whitespace-nowrap rounded-rounded transition-colors',
    on ? 'bg-action-primary-surface text-text-inverse' : 'text-text-default hover:bg-surface-hover-emphasis',
  )

// One spec knob (segmented pills) — used for Border weight / Selected border / Press scale.
function Segmented({ label, ariaLabel, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-150">
      <span className="text-center typography-label-emphasis-xsmall text-text-muted">{label}</span>
      <div
        className="flex w-fit gap-[2px] self-center rounded-rounded bg-surface-subtle p-[3px]"
        role="group"
        aria-label={ariaLabel || label}
      >
        {options.map(o => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange?.(o.value)}
            className={cx(segItem(value === o.value), 'typography-label-emphasis-xsmall')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ColorSwitcher({
  active = null,
  onSelect,
  stroke = '1px',
  onStroke,
  strokeSelected = '1.5px',
  onStrokeSelected,
  pressScale = '0.99',
  onPressScale,
  device = 'desktop',
  onDevice,
}) {
  const isCurrent = active == null
  // Explore families start collapsed; the group holding the active option auto-expands.
  const activeHeader = EXPLORE_FAMILIES.find(f => f.options.some(o => o.theme === active))?.header
  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(EXPLORE_FAMILIES.filter(f => f.header).map(f => [f.header, f.header !== activeHeader])),
  )
  const toggle = h => setCollapsed(c => ({ ...c, [h]: !c[h] }))
  // The whole explore drawer starts collapsed (to keep the panel short) and only
  // auto-opens when an exploration is the active option.
  const [exploreOpen, setExploreOpen] = useState(() => active != null)
  // Start collapsed only on small screens; desktop always shows the card.
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(max-width: 639px)').matches,
  )

  return (
    <>
      {/* Mobile-only collapsed launcher (never shown on desktop). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open design options"
        className={cx(
          'fixed left-4 top-1/2 z-[60] min-h-[38px] -translate-y-1/2 items-center gap-100 rounded-rounded border border-border-subtle bg-surface-default px-200 typography-label-emphasis-xsmall text-text-default shadow-[0_4px_16px_rgba(1,2,4,0.08)] sm:hidden',
          open ? 'hidden' : 'flex',
        )}
      >
        <span className="inline-block h-3 w-3 rounded-rounded bg-action-primary-surface" />
        Design
      </button>

      {/* Card — always visible on desktop; on mobile only when open. */}
      <div
        className={cx(
          'fixed left-4 top-1/2 z-[60] max-h-[calc(100svh-32px)] w-[168px] -translate-y-1/2 flex-col gap-450 overflow-y-auto rounded-medium border border-border-subtle bg-surface-default px-[13px] py-[21px] shadow-[0_4px_16px_rgba(1,2,4,0.08)] sm:flex',
          open ? 'flex' : 'hidden',
        )}
        role="group"
        aria-label="Design options"
      >
        {/* Collapse control — mobile only (desktop card stays open). */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse design options"
          className="absolute right-150 top-150 flex h-5 w-5 items-center justify-center rounded-rounded text-text-muted transition-colors hover:bg-surface-subtle sm:hidden"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* ===== Tier 1 — Current design (the shipped decision + its spec knobs) ===== */}
        {/* The pill is active when no exploration is applied; clicking it from an
            exploration returns to the shipped design. */}
        <button
          type="button"
          aria-pressed={isCurrent}
          onClick={() => onSelect?.(null)}
          className={cx(
            'flex h-[38px] items-center justify-center gap-100 whitespace-nowrap rounded-rounded px-150 typography-label-emphasis-xsmall transition-colors',
            isCurrent
              ? 'bg-action-primary-surface text-text-inverse'
              : 'bg-surface-subtle text-text-default hover:bg-surface-hover-emphasis',
          )}
        >
          {isCurrent && (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
              <path d="M13 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          Current design
        </button>

        <Segmented label="Border weight" options={STROKE_OPTIONS} value={stroke} onChange={onStroke} />
        <Segmented label="Selected border" ariaLabel="Selected border weight" options={SELECTED_STROKE_OPTIONS} value={strokeSelected} onChange={onStrokeSelected} />
        <Segmented label="Press scale (%)" ariaLabel="Press scale" options={PRESS_SCALE_OPTIONS} value={pressScale} onChange={onPressScale} />

        {/* ===== Tier 2 — Older explorations (collapsed by default to keep the panel short) ===== */}
        <div className="flex flex-col gap-450 border-t border-border-subtle pt-350">
          <button
            type="button"
            onClick={() => setExploreOpen(o => !o)}
            aria-expanded={exploreOpen}
            className="flex w-full items-center justify-center gap-100 typography-label-emphasis-xsmall text-text-muted"
          >
            Older explorations
            {/* Chevron points down when collapsed, up when open. */}
            <svg
              viewBox="0 0 16 16"
              className={cx('h-3.5 w-3.5 shrink-0 transition-transform', exploreOpen && 'rotate-180')}
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {exploreOpen &&
            EXPLORE_FAMILIES.map((family, fi) => {
              const isCollapsed = family.header && collapsed[family.header]
              return (
                <div key={family.header ?? `group-${fi}`} className="flex flex-col gap-150">
                  {family.header && (
                    <button
                      type="button"
                      onClick={() => toggle(family.header)}
                      aria-expanded={!isCollapsed}
                      className="flex w-full items-center justify-center gap-100 py-[2px] typography-label-emphasis-xsmall text-text-muted"
                    >
                      {family.header}
                      {/* Chevron sits 4px right of the label; points down when collapsed, up when open. */}
                      <svg
                        viewBox="0 0 16 16"
                        className={cx('h-3.5 w-3.5 shrink-0 transition-transform', !isCollapsed && 'rotate-180')}
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  {!isCollapsed &&
                    family.options.map(opt => {
                      const isActive = active === opt.theme
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => onSelect?.(opt.theme)}
                          className={cx(
                            'flex h-[38px] items-center justify-center whitespace-nowrap rounded-rounded px-150 typography-label-emphasis-xsmall transition-colors',
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
              )
            })}
        </div>

        {/* ===== Device — preview utility (desktop / mobile) ===== */}
        <div className="flex flex-col gap-150 border-t border-border-subtle pt-350">
          <span className="text-center typography-label-emphasis-xsmall text-text-muted">Device</span>
          <div className="flex w-fit gap-[2px] self-center rounded-rounded bg-surface-subtle p-[3px]" role="group" aria-label="Device">
            {DEVICE_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={device === value}
                aria-label={label}
                title={label}
                onClick={() => onDevice?.(value)}
                className={segItem(device === value)}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
