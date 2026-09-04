import clsx from 'clsx'

import styles from './SectionHeading.module.css'

export type SectionHeadingProps = {
  title: string
  description?: string
  eyebrow?: string
  className?: string
  compact?: boolean
}

export const SectionHeading = ({
  className,
  description,
  eyebrow,
  title,
  compact = false,
}: SectionHeadingProps) => {
  return (
    <header className={clsx(styles.root, compact && styles.compact, className)}>
      {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.text}>{description}</p> : null}
    </header>
  )
}
