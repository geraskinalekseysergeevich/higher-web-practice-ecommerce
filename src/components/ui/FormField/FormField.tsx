import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import styles from './FormField.module.css'

export type FormFieldProps = PropsWithChildren<{
  label: string
  id?: string
  requiredMark?: boolean
  error?: string
  className?: string
}>

export const FormField = ({
  children,
  className,
  error,
  id,
  label,
  requiredMark = false,
}: FormFieldProps) => {
  return (
    <div className={clsx(styles.root, className)} data-invalid={Boolean(error)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {requiredMark ? <span className={styles.required}>*</span> : null}
      </label>

      {children}
    </div>
  )
}
