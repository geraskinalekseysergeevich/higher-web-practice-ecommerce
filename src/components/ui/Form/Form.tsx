import clsx from 'clsx'
import type { FormHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

import { Card } from '../Card/Card'
import styles from './Form.module.css'

export type FormProps = PropsWithChildren<FormHTMLAttributes<HTMLFormElement>> & {
  title: string
  description?: string
  footer?: ReactNode
}

export function Form({
  children,
  className,
  description,
  footer,
  title,
  ...props
}: FormProps) {
  return (
    <Card className={clsx(styles.root, className)}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.text}>{description}</p> : null}
      </header>

      <form className={styles.form} {...props}>
        {children}
      </form>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Card>
  )
}
