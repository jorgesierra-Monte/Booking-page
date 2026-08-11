import { useState } from 'react'
import styles from './Calendar.module.css'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
  return cells
}

export default function Calendar({ selected, onSelect, availableFrom }) {
  const [view, setView] = useState(() => new Date((selected ?? availableFrom).getFullYear(), (selected ?? availableFrom).getMonth(), 1))

  const grid = buildGrid(view)

  function step(delta) {
    setView(v => new Date(v.getFullYear(), v.getMonth() + delta, 1))
  }

  // A day is bookable if it's in the displayed month and not before availableFrom
  function isAvailable(cell) {
    if (!cell.inMonth) return false
    const d0 = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate())
    const a0 = new Date(availableFrom.getFullYear(), availableFrom.getMonth(), availableFrom.getDate())
    return d0 >= a0
  }

  const canGoPrev =
    view.getFullYear() > availableFrom.getFullYear() ||
    (view.getFullYear() === availableFrom.getFullYear() && view.getMonth() > availableFrom.getMonth())

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => step(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className={styles.title}>{MONTHS[view.getMonth()]} {view.getFullYear()}</span>
        <button type="button" className={styles.navBtn} onClick={() => step(1)} aria-label="Next month">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(w => <span key={w} className={styles.weekday}>{w}</span>)}
      </div>

      <div className={styles.grid}>
        {grid.map((cell, i) => {
          const available = isAvailable(cell)
          const isSelected = sameDay(cell.date, selected)
          return (
            <div key={i} className={styles.cellWrap}>
              <button
                type="button"
                className={[
                  styles.day,
                  isSelected ? styles.selected : '',
                  !cell.inMonth ? styles.outside : '',
                ].join(' ')}
                disabled={!available}
                onClick={() => available && onSelect(cell.date)}
              >
                {cell.date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
