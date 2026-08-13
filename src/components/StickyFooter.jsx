import styles from './StickyFooter.module.css'

export default function StickyFooter({ price, meta, schedule, disabled }) {
  return (
    <div className={styles.footer}>
      <div className={styles.summary}>
        <div className={styles.topRow}>
          <span className={styles.price}>{price}</span>
          <span className={styles.meta}>{meta}</span>
        </div>
        <span className={styles.schedule}>{schedule}</span>
      </div>
      <button type="button" className={styles.book} disabled={disabled}>
        Book now
      </button>
    </div>
  )
}
