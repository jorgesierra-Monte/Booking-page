import styles from './TimeSlots.module.css'

const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

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
    <div className={styles.panel}>
      <div className={styles.dateHeader}>{heading}</div>
      <div className={styles.buttons}>
        {TIME_SLOTS.map(slot => (
          <button
            key={slot}
            type="button"
            className={[styles.slot, selected === slot ? styles.selected : ''].join(' ')}
            onClick={() => onSelect(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  )
}
