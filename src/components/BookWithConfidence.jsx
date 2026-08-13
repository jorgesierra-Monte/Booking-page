import styles from './BookWithConfidence.module.css'

const ITEMS = [
  {
    title: 'Free cancellation',
    body: "It's free to cancel or reschedule up to 24 hours before your appointment begins, for any reason.",
  },
  {
    title: 'Insurance verified',
    body: 'We verify your coverage and benefits before your first session, so there are no billing surprises.',
  },
  {
    title: 'Your data is protected',
    body: 'Your information is kept private and secure in accordance with HIPAA.',
  },
]

export default function BookWithConfidence() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Book with confidence</h2>
      <ul className={styles.list}>
        {ITEMS.map(item => (
          <li key={item.title} className={styles.item}>
            <span className={styles.check} aria-hidden="true">✓</span>
            <div className={styles.text}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemBody}>{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
