import styles from './PromoBanner.module.css'

export default function PromoBanner({ image, header, description, linkLabel, variant = 'brown' }) {
  return (
    <div className={[styles.banner, styles[variant]].join(' ')}>
      <div className={styles.image}>
        <img src={image} alt="" />
      </div>
      <div className={styles.body}>
        <div className={styles.text}>
          <p className={styles.header}>{header}</p>
          <p className={styles.description}>{description}</p>
        </div>
        <a href="#" className={styles.link}>{linkLabel}</a>
      </div>
    </div>
  )
}
