import { useState } from 'react'
import styles from './RadioGroup.module.css'

export default function RadioGroup({ name, options, value: controlled, defaultValue, onChange, columns = 2 }) {
  const isControlled = controlled !== undefined
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value)
  const value = isControlled ? controlled : internal

  function select(v) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <div
      className={styles.group}
      role="radiogroup"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map(opt => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={[styles.card, selected ? styles.selected : ''].join(' ')}
            onClick={() => select(opt.value)}
          >
            <span className={styles.text}>
              <span className={styles.title}>{opt.label}</span>
              {opt.description && <span className={styles.description}>{opt.description}</span>}
            </span>
            <span className={styles.radio} aria-hidden="true">
              <span className={styles.dot} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
