// Lightweight recreations of the @growtherapy/sprout-ui primitives used on the
// booking page, styled to the arc/live (Season VF) brand.
import { useEffect, useRef, useState } from 'react'

const cx = (...c) => c.filter(Boolean).join(' ')

/* ---------------- Card ---------------- */
export function Card({ className, children }) {
  return <div className={cx('w-full bg-surface-default', className)}>{children}</div>
}

/* ---------------- Divider ---------------- */
export function Divider({ className }) {
  return <div role="separator" className={cx('w-full border-t border-border-subtle', className)} />
}

/* ---------------- Button ---------------- */
export function Button({ use = 'primary', className, children, ...rest }) {
  const isLink = use === 'link-secondary'
  const base = cx(
    'inline-flex items-center justify-center typography-label-emphasis-default transition disabled:opacity-50 disabled:cursor-not-allowed',
    // BETA Button V2: 8px radius, px-300 py-275. Links sit flush with no padding.
    !isLink && 'rounded-small px-300 py-275',
  )
  const uses = {
    primary:
      'bg-action-primary-surface text-action-primary-text hover:bg-action-primary-hover active:bg-action-primary-pressed',
    secondary:
      'bg-action-secondary-surface text-action-secondary-text ring-1 ring-action-secondary-border hover:bg-action-secondary-hover active:bg-surface-pressed',
    'link-secondary': 'underline underline-offset-4 text-text-default hover:text-text-muted bg-transparent',
  }
  return (
    <button type="button" className={cx(base, uses[use], className)} {...rest}>
      {children}
    </button>
  )
}

/* ---------------- Tag (Grow Verified) ---------------- */
export function Tag({ children, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-x-100 rounded-rounded bg-surface-emphasis px-200 py-100 typography-eyebrow-default text-text-default',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------------- Filled circle-check (verified badge icon) ---------------- */
export function CircleCheck({ className }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-rounded bg-surface-inverse text-text-inverse',
        className,
      )}
    >
      <Check className="h-[9px] w-[9px]" />
    </span>
  )
}

/* ---------------- Avatar ---------------- */
export function Avatar({ src, alt, size = 'xl' }) {
  const dims = { lg: 'h-[100px] w-[100px]', xl: 'h-[136px] w-[136px]' }
  return (
    <div className="shrink-0">
      <img src={src} alt={alt} className={cx('rounded-small object-cover object-top', dims[size])} />
    </div>
  )
}

/* ---------------- Check icon ---------------- */
export function Check({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cx('shrink-0', className)} aria-hidden="true">
      <path d="M13 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------------- Arc floating-label field (shared) ---------------- */
// Box: white, 8px radius, 1.25px border/default; focus → 2px near-black ring.
const fieldShell =
  'relative w-full rounded-small bg-surface-default ring-[1.25px] ring-inset ring-border-default transition focus-within:ring-2 focus-within:ring-border-strong'
const floatEase = { transitionDuration: 'var(--float-duration)', transitionTimingFunction: 'var(--float-ease)' }

function FloatLabel({ label, required, optional, active }) {
  return (
    <span
      style={floatEase}
      className={cx(
        'pointer-events-none absolute left-250 z-[1] origin-left transition-all',
        active
          ? 'top-[7px] typography-body-xsmall text-text-muted'
          : 'top-1/2 -translate-y-1/2 typography-label-default text-text-default',
      )}
    >
      {label}
      {optional && <span className="text-text-muted"> (optional)</span>}
      {required && ' *'}
    </span>
  )
}

const fieldInput =
  'h-[52px] w-full rounded-small bg-transparent px-250 pb-[6px] pt-[22px] typography-label-default text-text-default outline-none placeholder:text-text-muted transition-opacity duration-100 ease-out'

export function TextField({ label, placeholder, required, optional, type = 'text', inputMode }) {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')
  const active = focused || value !== ''
  return (
    <div className={fieldShell}>
      <FloatLabel label={label} required={required} optional={optional} active={active} />
      {/* Input (with placeholder/masked text) fades in as the label floats up,
          so the label and text never visibly overlap mid-animation. */}
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cx(fieldInput, active ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}

// Custom dropdown (BETA Select V2): styled flyout list — rows tint #f1efec on
// hover, selected row tints #f1efec with a checkmark. (Native <select> can't be styled.)
export function SelectField({ label, options = [], placeholder, required, optional }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const ref = useRef(null)
  const active = open || value !== ''

  useEffect(() => {
    if (!open) return
    const onDown = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = e => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={cx(fieldShell, 'relative')}>
      <FloatLabel label={label} required={required} optional={optional} active={active} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex h-[52px] w-full items-center rounded-small bg-transparent px-250 pb-[6px] pr-450 pt-[22px] typography-label-default text-text-default outline-none"
      >
        <span
          className={cx(
            'truncate transition-opacity duration-100 ease-out',
            active ? 'opacity-100' : 'opacity-0',
            value === '' && 'text-text-muted',
          )}
        >
          {value || placeholder || ''}
        </span>
      </button>
      <svg
        viewBox="0 0 20 20"
        className={cx(
          'pointer-events-none absolute right-250 top-1/2 h-4 w-4 -translate-y-1/2 text-text-default transition-transform',
          open && 'rotate-180',
        )}
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {open && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+4px)] z-20 flex max-h-[288px] flex-col gap-100 overflow-y-auto rounded-small border-[1.25px] border-border-subtle bg-surface-default p-100 shadow-card"
        >
          {options.map(o => {
            const selected = o === value
            return (
              <button
                key={o}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setValue(o)
                  setOpen(false)
                }}
                className={cx(
                  'flex h-12 shrink-0 items-center justify-between rounded-xsmall px-200 typography-label-default text-text-default transition-colors',
                  selected ? 'bg-surface-state-selected-brand' : 'hover:bg-surface-hover-default',
                )}
              >
                <span className="truncate text-left">{o}</span>
                {selected && <Check className="ml-200 h-5 w-5 shrink-0 text-text-default" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------------- Standalone radio indicator (BETA Radio Standalone V2) ----------------
   default: 16px white circle, 1.25px #817f7d border
   hover:   border darkens to #403f3e + 24px #f1efec halo behind
   selected: 16px black (#010204) fill with a 6px white center dot          */
export function RadioDot({ selected }) {
  return (
    <span className="relative ml-200 flex h-4 w-4 shrink-0 items-center justify-center">
      {!selected && (
        <span className="pointer-events-none absolute h-6 w-6 rounded-rounded bg-surface-hover-default opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <span
        className={cx(
          'relative flex h-4 w-4 items-center justify-center rounded-rounded transition-colors',
          selected
            ? 'bg-surface-inverse'
            : 'border-[1.25px] border-border-default bg-surface-default group-hover:border-[#403f3e]',
        )}
      >
        {selected && <span className="h-[6px] w-[6px] rounded-rounded bg-surface-default" />}
      </span>
    </span>
  )
}

/* ---------------- Radio tiles (card-style radio) ---------------- */
export function RadioTiles({ name, options, value, onChange, columns = 2, gap = 'gap-200', className }) {
  const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3' }
  return (
    <div role="radiogroup" className={cx('grid', gap, cols[columns], className)}>
      {options.map(opt => {
        const selected = value === opt.value
        const expanded = selected && opt.content
        return (
          <div
            key={opt.value}
            className={cx(
              'rounded-small bg-surface-default transition',
              selected
                ? 'ring-2 ring-border-state-selected-default bg-surface-state-selected-brand'
                : 'ring-[1.25px] ring-border-default hover:bg-surface-hover-default',
            )}
          >
            <label className="group flex cursor-pointer items-center justify-between px-300 py-275 typography-label-emphasis-default">
              <span>{opt.label}</span>
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={selected}
                onChange={() => onChange(opt.value)}
              />
              <RadioDot selected={selected} />
            </label>
            {expanded && <div className="px-300 pb-350">{opt.content}</div>}
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- Selectable button group (Arc ButtonSelectable) ----------------
   Same component as the time selector: white / 1.25px border / 8px radius / 52px,
   hover #f1efec, pressed #cac6c2, selected 2px #4a412d + #f1efec. No radio dot.   */
export function SelectableGroup({ options, value, onChange, columns = 3, className }) {
  const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3' }
  return (
    <div className={cx('grid gap-200', cols[columns], className)}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cx(
              'flex min-h-component-mediumButtons items-center justify-center rounded-small bg-surface-default px-400 typography-label-emphasis-default text-text-default transition',
              selected
                ? 'ring-2 ring-inset ring-border-state-selected-default bg-surface-state-selected-brand'
                : 'ring-[1.25px] ring-inset ring-border-default hover:bg-surface-hover-default active:bg-[#cac6c2]',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Checkbox row (BETA Checkbox Standalone V2 states) ----------------
   default: 16px white box, 1.25px #817f7d border, 4px radius
   hover:   border darkens to #403f3e + #f1efec halo behind
   checked: 16px #010204 fill with a white check                                    */
export function CheckboxRow({ checked, onChange, children }) {
  return (
    <label className="group flex w-full cursor-pointer items-start gap-150 text-text-default">
      <span className="relative mt-100 flex h-4 w-4 shrink-0 items-center justify-center">
        {!checked && (
          <span className="pointer-events-none absolute h-6 w-6 rounded-small bg-surface-hover-default opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        <span
          className={cx(
            'relative flex h-4 w-4 items-center justify-center rounded-xsmall transition-colors',
            checked
              ? 'bg-surface-inverse text-text-inverse'
              : 'border-[1.25px] border-border-default bg-surface-default group-hover:border-[#403f3e]',
          )}
        >
          {checked && <Check className="h-[11px] w-[11px]" />}
        </span>
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="typography-body-small text-left">{children}</span>
    </label>
  )
}

/* ---------------- Collapsible "add" link (chosen name / apt) ---------------- */
export function AddMoreLink({ label, children }) {
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <Button use="link-secondary" className="typography-label-small min-h-[44px] self-start" onClick={() => setOpen(true)}>
        {label}
      </Button>
    )
  return <>{children}</>
}
