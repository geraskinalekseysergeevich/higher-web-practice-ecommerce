import clsx from 'clsx'

import styles from './SectionHeading.module.css'

export type SectionHeadingProps = {
  title: string
  description?: string
  eyebrow?: string
  className?: string
}

export function SectionHeading({
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <header className={clsx(styles.root, className)}>
      {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.text}>{description}</p> : null}
    </header>
  )
}
