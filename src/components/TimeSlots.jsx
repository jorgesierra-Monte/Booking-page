const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const cx = (...c) => c.filter(Boolean).join(' ')

export const TIME_SLOTS = [
  '9:00 am – 9:45 am CST',
  '10:00 am – 10:45 am CST',
  '11:00 am – 11:45 am CST',
  '12:00 pm – 12:45 pm CST',
  '1:00 pm – 1:45 pm CST',
]

export default function TimeSlots({ date, selected, onSelect }) {
  const heading = date
    ? `${WEEKDAYS_LONG[date.getDay()]}, ${MONTHS_LONG[date.getMonth()]} ${date.getDate()}`
    : 'Select a day'

  return (
    <div className="w-full">
      <div className="mb-200 flex h-8 items-center justify-center text-center typography-label-emphasis-default text-text-default">
        {heading}
      </div>
      <div className="flex flex-col gap-150">
        {TIME_SLOTS.map(slot => {
          const isSelected = selected === slot
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelect(slot)}
              className={cx(
                'flex min-h-component-mediumButtons w-full items-center justify-center rounded-small px-350 typography-label-emphasis-default transition',
                isSelected
                  ? 'ring-[length:var(--stroke-weight)] ring-inset ring-[var(--select-border-selected)] bg-[var(--select-tile-surface-selected)] text-[var(--select-tile-text-selected)]'
                  : 'ring-[length:var(--stroke-weight)] ring-inset ring-[color:var(--tile-border)] bg-[var(--tile-surface)] text-text-default hover:bg-[var(--tile-surface-hover)]',
              )}
            >
              {slot}
            </button>
          )
        })}
      </div>
    </div>
  )
}
