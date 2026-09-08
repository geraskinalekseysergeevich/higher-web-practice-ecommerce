import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import { Button } from '../Button/Button'
import styles from './EmptyState.module.css'

export type EmptyStateProps = PropsWithChildren<{
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}>

export const EmptyState = ({
  actionLabel,
  children,
  className,
  description,
  onAction,
  title,
}: EmptyStateProps) => {
  return (
    <section className={clsx(styles.root, className)}>
      <div className={styles.label}>Пусто</div>
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.text}>{description}</p> : null}
      {children}
      {actionLabel && onAction ? (
        <Button className={styles.action} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  )
}
