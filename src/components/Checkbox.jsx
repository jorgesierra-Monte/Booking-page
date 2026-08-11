import { useState } from 'react'
import styles from './Checkbox.module.css'

export default function Checkbox({ checked: controlled, defaultChecked = false, onChange, children, id }) {
  const isControlled = controlled !== undefined
  const [internal, setInternal] = useState(defaultChecked)
  const checked = isControlled ? controlled : internal

  function toggle() {
    const next = !checked
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <label className={styles.wrapper}>
      <input
        id={id}
        type="checkbox"
        className={styles.native}
        checked={checked}
        onChange={toggle}
      />
      <span className={[styles.box, checked ? styles.checked : ''].join(' ')} aria-hidden="true">
        <svg className={styles.check} width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={styles.label}>{children}</span>
    </label>
  )
}
