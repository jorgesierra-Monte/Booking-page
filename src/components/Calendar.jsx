import { useState } from 'react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const cx = (...c) => c.filter(Boolean).join(' ')

function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Build a 6-row grid of date cells for the month containing `viewDate`
function buildGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay() // 0 = Sun
  const start = new Date(year, month, 1 - firstDay)
  const cells = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({ date: d, inMonth: d.getMonth() === month })
  }
  // chunk into weeks of 7
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function Chevron({ dir }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M10 3.5L5.5 8L10 12.5' : 'M6 3.5L10.5 8L6 12.5'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Calendar({ selected, onSelect, availableFrom }) {
  const [view, setView] = useState(
    () => new Date((selected ?? availableFrom).getFullYear(), (selected ?? availableFrom).getMonth(), 1),
  )

  const weeks = buildGrid(view)

  function step(delta) {
    setView(v => new Date(v.getFullYear(), v.getMonth() + delta, 1))
  }

  function isAvailable(cell) {
    if (!cell.inMonth) return false
    const d0 = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate())
    const a0 = new Date(availableFrom.getFullYear(), availableFrom.getMonth(), availableFrom.getDate())
    return d0 >= a0
  }

  const canGoPrev =
    view.getFullYear() > availableFrom.getFullYear() ||
    (view.getFullYear() === availableFrom.getFullYear() && view.getMonth() > availableFrom.getMonth())

  const navBtn =
    'flex items-center justify-center rounded-small p-100 text-text-default transition hover:bg-surface-hover-default disabled:opacity-30 disabled:hover:bg-transparent'
  // 44px cells, packed (matches Arc BETA Date picker V2)
  const cellBase = 'flex size-11 items-center justify-center'

  return (
    <div className="w-full select-none sm:w-fit">
      <div className="mb-200 flex items-center justify-between gap-200">
        <button type="button" className={navBtn} onClick={() => step(-1)} disabled={!canGoPrev} aria-label="Previous month">
          <Chevron dir="prev" />
        </button>
        <span className="flex-1 text-center typography-label-emphasis-default">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button type="button" className={navBtn} onClick={() => step(1)} aria-label="Next month">
          <Chevron dir="next" />
        </button>
      </div>

      <div className="flex justify-between sm:justify-start">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className={cx(cellBase, 'typography-label-emphasis-default text-text-default')}>
            {w}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-100">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex justify-between sm:justify-start">
            {week.map((cell, ci) => {
              if (!cell.inMonth) return <span key={ci} className="size-11" />
              const available = isAvailable(cell)
              const isSelected = sameDay(cell.date, selected)
              return (
                <button
                  key={ci}
                  type="button"
                  disabled={!available}
                  onClick={() => available && onSelect(cell.date)}
                  className={cx(
                    cellBase,
                    'rounded-small typography-label-default transition',
                    isSelected
                      ? 'bg-[var(--day-surface-selected)] text-[var(--day-text-selected)] ring-[length:var(--stroke-weight-selected)] ring-inset ring-[var(--select-border-selected)]'
                      : available
                        ? 'text-text-default hover:bg-[var(--tile-surface-hover)] active:bg-[#cac6c2]'
                        : 'text-text-muted opacity-50',
                  )}
                >
                  {cell.date.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
