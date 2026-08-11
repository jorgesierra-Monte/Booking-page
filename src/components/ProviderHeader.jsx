import styles from './ProviderHeader.module.css'

export default function ProviderHeader() {
  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        <img src="/provider-avatar.png" alt="Daunte Henderson" />
      </div>

      <div className={styles.info}>
        <span className={styles.tag}>New to Grow</span>
        <h1 className={styles.name}>Daunte<br />Henderson</h1>
        <span className={styles.pronouns}>(he/him)</span>
      </div>

      <div className={styles.price}>
        <span className={styles.amount}>$144</span>
        <span className={styles.session}>30 minute session</span>
      </div>
    </div>
  )
}
