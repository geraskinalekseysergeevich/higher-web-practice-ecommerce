import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

import { DropdownIcon } from '../Icons/Icons'
import styles from './SelectButton.module.css'

export type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  open?: boolean
}

export const SelectButton = ({
  className,
  label,
  open = false,
  ...props
}: SelectButtonProps) => (
  <button
    aria-expanded={open}
    className={clsx(styles.root, className)}
    type="button"
    {...props}
  >
    <span className={styles.label}>{label}</span>
    <DropdownIcon className={clsx(styles.icon, open && styles.open)} />
  </button>
)
