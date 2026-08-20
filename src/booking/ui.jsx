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
    'inline-flex items-center justify-center typography-label-emphasis-default transition disabled:cursor-not-allowed',
    // Arc Button V2: px-300 py-275. Links sit flush with no padding.
    !isLink && 'px-300 py-275',
  )
  const uses = {
    // Arc Button V2 primary: fully-rounded pill, near-black surface, white text.
    // Disabled → #b1aeaa surface / #313132 text (inactive tokens, not opacity).
    primary:
      'rounded-rounded bg-action-primary-surface text-action-primary-text hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:bg-[#b1aeaa] disabled:text-[#313132]',
    secondary:
      'rounded-small bg-action-secondary-surface text-action-secondary-text ring-1 ring-action-secondary-border hover:bg-action-secondary-hover active:bg-surface-pressed disabled:opacity-50',
    'link-secondary': 'underline underline-offset-4 text-text-default hover:text-text-muted bg-transparent disabled:opacity-50',
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
// Arc BETA Text Input V2 states, driven by --field-* tokens so a color option can
// swap the whole treatment (e.g. bordered → borderless filled). 1px border throughout;
// `:hover:not(:focus-within)` keeps focus winning over hover deterministically.
//   bordered default: bg #fff · rest #817f7d · hover #403f3e · focus #2e291e
//   filled option:    bg #f5f5f3/#ebeae8 · transparent border · focus #cac6c2
const fieldShell =
  'relative w-full rounded-small ring-[length:var(--stroke-weight)] ring-inset transition bg-[var(--field-surface)] ring-[color:var(--field-border)] [&:hover:not(:focus-within)]:bg-[var(--field-surface-hover)] [&:hover:not(:focus-within)]:ring-[color:var(--field-border-hover)] focus-within:ring-[color:var(--field-border-focus)]'
const floatEase = { transitionDuration: 'var(--float-duration)', transitionTimingFunction: 'var(--float-ease)' }

function FloatLabel({ label, required, optional, active }) {
  return (
    <span
      style={floatEase}
      className={cx(
        'pointer-events-none absolute left-250 z-[1] origin-left transition-all',
        active
          ? 'top-[7px] typography-body-xsmall text-text-default'
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

export function TextField({ label, placeholder, required, optional, type = 'text', inputMode, mask }) {
  if (mask && MASK_CONFIG[mask]) {
    return <MaskedField label={label} required={required} optional={optional} inputMode={inputMode} mask={mask} />
  }
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

// Masked variant (Arc BETA Text Input V2 · Masked): shows the full mask skeleton —
// typed digits render in default text, the remaining template stays muted, e.g.
// "(415) 000-0000". A skeleton overlay sits under a transparent-text input so the
// caret lands exactly at the typed/skeleton boundary.
const MASK_CONFIG = {
  phone: { template: '(000) 000-0000', slots: [1, 2, 3, 6, 7, 8, 10, 11, 12, 13] },
  date: { template: 'MM/DD/YYYY', slots: [0, 1, 3, 4, 6, 7, 8, 9] },
}

function MaskedField({ label, required, optional, inputMode, mask }) {
  const cfg = MASK_CONFIG[mask]
  const [focused, setFocused] = useState(false)
  const [digits, setDigits] = useState('')
  const active = focused || digits.length > 0

  const chars = cfg.template.split('')
  cfg.slots.forEach((pos, i) => {
    if (i < digits.length) chars[pos] = digits[i]
  })
  const boundary = digits.length > 0 ? cfg.slots[digits.length - 1] + 1 : 0
  const darkText = chars.slice(0, boundary).join('')
  const skeletonText = chars.slice(boundary).join('')

  const onKeyDown = e => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      if (digits.length < cfg.slots.length) setDigits(d => d + e.key)
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      setDigits(d => d.slice(0, -1))
    }
  }

  return (
    <div className={fieldShell}>
      <FloatLabel label={label} required={required} optional={optional} active={active} />
      {/* Skeleton overlay — typed portion in default text, remainder muted. */}
      <div
        aria-hidden="true"
        className={cx(
          'pointer-events-none absolute inset-0 px-250 pt-[22px] pb-[6px] transition-opacity duration-100 ease-out',
          active ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="flex h-full items-center whitespace-pre typography-label-default">
          <span className="text-text-default">{darkText}</span>
          <span className="text-text-muted">{skeletonText}</span>
        </div>
      </div>
      <input
        inputMode={inputMode}
        value={darkText}
        onKeyDown={onKeyDown}
        onChange={() => {}}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cx(fieldInput, 'text-transparent caret-[#010204]', active ? 'opacity-100' : 'opacity-0')}
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
    <div
      ref={ref}
      className={cx(
        'relative w-full rounded-small ring-[length:var(--stroke-weight)] ring-inset transition bg-[var(--field-surface)]',
        open
          ? 'ring-[color:var(--field-border-open)]'
          : 'ring-[color:var(--field-border)] [&:hover:not(:focus-within)]:bg-[var(--field-surface-hover)] [&:hover:not(:focus-within)]:ring-[color:var(--field-border-hover)]',
      )}
    >
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
          className="absolute inset-x-0 top-[calc(100%+4px)] z-20 flex max-h-[288px] flex-col gap-100 overflow-y-auto rounded-small border-[length:var(--stroke-weight)] border-[color:var(--dropdown-border)] bg-[var(--dropdown-surface)] p-100"
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
                  'flex h-12 shrink-0 items-center justify-between rounded-xsmall px-200 typography-label-default transition-colors',
                  selected
                    ? 'bg-[var(--dropdown-row-surface-selected)] text-[var(--dropdown-row-text-selected)]'
                    : 'text-text-default hover:bg-[var(--tile-surface-hover)]',
                )}
              >
                <span className="truncate text-left">{o}</span>
                {selected && <Check className="ml-200 h-5 w-5 shrink-0 text-[var(--dropdown-row-text-selected)]" />}
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
            ? 'bg-[var(--radio-dot-surface)]'
            : 'border-[length:var(--stroke-weight)] border-border-default bg-[var(--tile-surface)]',
        )}
      >
        {selected && <span className="h-[6px] w-[6px] rounded-rounded bg-[var(--radio-dot-center)]" />}
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
              'rounded-small transition',
              selected
                ? 'ring-[1.5px] ring-[var(--select-border-selected)] bg-[var(--select-tile-surface-selected)] text-[var(--select-tile-text-selected)]'
                : 'ring-[length:var(--stroke-weight)] ring-[color:var(--tile-border)] bg-[var(--tile-surface)] hover:bg-[var(--tile-surface-hover)]',
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
            {/* Reset text color: the selected tile paints its label white in
                dark themes, but the expanded content card needs its own dark text. */}
            {expanded && <div className="px-300 pb-350 text-text-default">{opt.content}</div>}
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
              'flex min-h-component-mediumButtons items-center justify-center rounded-small px-350 typography-label-emphasis-default transition',
              selected
                ? 'ring-[1.5px] ring-inset ring-[var(--select-border-selected)] bg-[var(--select-tile-surface-selected)] text-[var(--select-tile-text-selected)]'
                : 'ring-[length:var(--stroke-weight)] ring-inset ring-[color:var(--tile-border)] bg-[var(--tile-surface)] text-text-default hover:bg-[var(--tile-surface-hover)]',
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
