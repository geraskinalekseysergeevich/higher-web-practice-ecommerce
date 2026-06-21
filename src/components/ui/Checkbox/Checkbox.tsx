import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'

import styles from './Checkbox.module.css'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: string
  error?: string
  requiredMark?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, id, label, requiredMark = false, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id ?? generatedId
    const errorId = error ? `${checkboxId}-error` : undefined

    return (
      <div className={styles.root}>
        <label className={styles.field} htmlFor={checkboxId}>
          <input
            ref={ref}
            aria-describedby={errorId}
            aria-invalid={Boolean(error)}
            className={clsx(styles.control, error && styles.invalid, className)}
            id={checkboxId}
            type="checkbox"
            {...props}
          />

          <span className={styles.label}>
            {label}
            {requiredMark ? <span className={styles.required}>*</span> : null}
          </span>
        </label>

        {error ? (
          <span className={styles.error} id={errorId} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    )
  }
)
