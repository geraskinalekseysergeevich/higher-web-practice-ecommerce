import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'

import styles from './Switch.module.css'

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label?: string
  error?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const generatedId = useId()
    const switchId = id ?? generatedId
    const errorId = error ? `${switchId}-error` : undefined

    return (
      <div className={clsx(styles.root, className)}>
        <label className={styles.field} htmlFor={switchId}>
          <span className={styles.control}>
            <input
              ref={ref}
              aria-describedby={errorId}
              aria-invalid={Boolean(error)}
              className={styles.input}
              id={switchId}
              type="checkbox"
              {...props}
            />
            <span className={styles.track} aria-hidden="true">
              <span className={styles.knob} />
            </span>
          </span>

          {label ? <span className={styles.label}>{label}</span> : null}
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
