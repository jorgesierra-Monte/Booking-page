import styles from './SectionSubhead.module.css'

export default function SectionSubhead({ children, info }) {
  return (
    <div className={styles.subhead}>
      <h2 className={styles.title}>{children}</h2>
      {info && (
        <span className={styles.info} role="img" aria-label="More info">?</span>
      )}
    </div>
  )
}
