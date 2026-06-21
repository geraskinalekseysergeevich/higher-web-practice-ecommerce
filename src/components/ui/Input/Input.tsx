import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'

import styles from './Input.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  requiredMark?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, id, label, requiredMark = false, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <label className={styles.root} htmlFor={inputId}>
      {label ? (
        <span className={styles.label}>
          {label}
          {requiredMark ? <span className={styles.required}>*</span> : null}
        </span>
      ) : null}

      <input
        ref={ref}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={clsx(styles.control, error && styles.invalid, className)}
        id={inputId}
        {...props}
      />

      {error ? (
        <span className={styles.error} id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
})
