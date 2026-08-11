import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <button type="button" className={styles.back} aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={styles.logo}>
        <img src="/grow-logo.svg" alt="Grow" />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.login}>Log in</button>
        <button type="button" className={styles.menu}>Menu</button>
      </div>
    </nav>
  )
}
