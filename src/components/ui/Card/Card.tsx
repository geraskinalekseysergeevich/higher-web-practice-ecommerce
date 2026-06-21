import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import styles from './Card.module.css'

export type CardProps = PropsWithChildren<{
  className?: string
}>

export function Card({ children, className }: CardProps) {
  return <div className={clsx(styles.root, className)}>{children}</div>
}
