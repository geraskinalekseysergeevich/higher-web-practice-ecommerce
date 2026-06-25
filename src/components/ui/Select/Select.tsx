import clsx from 'clsx'
import type { SelectHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'

import styles from './Select.module.css'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  requiredMark?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, id, label, requiredMark = false, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const errorId = error ? `${selectId}-error` : undefined

    return (
      <label className={styles.root} htmlFor={selectId}>
        {label ? (
          <span className={styles.label}>
            {label}
            {requiredMark ? <span className={styles.required}>*</span> : null}
          </span>
        ) : null}

        <select
          ref={ref}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={clsx(styles.control, error && styles.invalid, className)}
          id={selectId}
          {...props}
        />

        {error ? (
          <span className={styles.error} id={errorId} role="alert">
            {error}
          </span>
        ) : null}
      </label>
    )
  }
)
