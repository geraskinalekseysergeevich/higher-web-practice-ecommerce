import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import styles from './FormField.module.css'

export type FormFieldProps = PropsWithChildren<{
  label: string
  requiredMark?: boolean
  error?: string
  className?: string
}>

export const FormField = ({
  children,
  className,
  error,
  label,
  requiredMark = false,
}: FormFieldProps) => {
  return (
    <label className={clsx(styles.root, className)}>
      <span className={styles.label}>
        {label}
        {requiredMark ? <span className={styles.required}>*</span> : null}
      </span>

      {children}

      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}
