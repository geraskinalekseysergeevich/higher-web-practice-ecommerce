import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'

import styles from './Radio.module.css'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  error?: string
  requiredMark?: boolean
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error, id, label, requiredMark = false, ...props }, ref) => {
    const generatedId = useId()
    const radioId = id ?? generatedId
    const errorId = error ? `${radioId}-error` : undefined

    return (
      <div className={clsx(styles.root, className)}>
        <label className={styles.field} htmlFor={radioId}>
          <span className={styles.control}>
            <input
              ref={ref}
              aria-describedby={errorId}
              aria-invalid={Boolean(error)}
              className={styles.input}
              id={radioId}
              type="radio"
              {...props}
            />
            <span className={styles.circle} aria-hidden="true">
              <span className={styles.dot} />
            </span>
          </span>

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
