// Floating color-option switcher — a dev/review control for comparing selected-state
// color treatments (radio, selectable, day selector, dropdown) side by side, plus
// border-weight and device (desktop/mobile) controls.
// Fully controlled: the parent (BookingPage) owns theme / stroke / device, persists
// them, and applies theme + stroke to the document (so an embedded preview iframe
// picks them up too). Chrome matches the Figma "floating nav" (node 2646-4896) and
// uses tokens NOT touched by any theme block, so it never restyles itself.
// Desktop: compact card, always visible. Mobile: collapses to a launcher pill.
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
    'flex h-[30px] flex-1 items-center justify-center rounded-rounded transition-colors',
    on ? 'bg-action-primary-surface text-text-inverse' : 'text-text-default hover:bg-surface-hover-emphasis',
  )

export function ColorSwitcher({
  active = null,
  onSelect,
  stroke = '1px',
  onStroke,
  strokeSelected = '1.5px',
  onStrokeSelected,
  device = 'desktop',
  onDevice,
}) {
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
          'fixed left-4 top-1/2 z-[60] max-h-[calc(100svh-32px)] w-[131px] -translate-y-1/2 flex-col gap-450 overflow-y-auto rounded-medium border border-border-subtle bg-surface-default px-[13px] py-[21px] shadow-[0_4px_16px_rgba(1,2,4,0.08)] sm:flex',
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

        {/* Border weight — segmented toggle (1 / 1.25 / 2 px). */}
        <div className="flex flex-col gap-150">
          <span className="text-center typography-label-emphasis-xsmall text-text-muted">Border weight</span>
          <div className="flex gap-[2px] rounded-rounded bg-surface-subtle p-[3px]" role="group" aria-label="Border weight">
            {STROKE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                aria-pressed={stroke === o.value}
                onClick={() => onStroke?.(o.value)}
                className={cx(segItem(stroke === o.value), 'typography-label-small')}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected border — weight of the selected-state ring on selectable buttons. */}
        <div className="flex flex-col gap-150">
          <span className="text-center typography-label-emphasis-xsmall text-text-muted">Selected border</span>
          <div className="flex gap-[2px] rounded-rounded bg-surface-subtle p-[3px]" role="group" aria-label="Selected border weight">
            {SELECTED_STROKE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                aria-pressed={strokeSelected === o.value}
                onClick={() => onStrokeSelected?.(o.value)}
                className={cx(segItem(strokeSelected === o.value), 'typography-label-small')}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Device — icon segmented toggle (desktop / mobile). */}
        <div className="flex flex-col gap-150">
          <span className="text-center typography-label-emphasis-xsmall text-text-muted">Device</span>
          <div className="flex gap-[2px] rounded-rounded bg-surface-subtle p-[3px]" role="group" aria-label="Device">
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
