import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

import styles from './ListButton.module.css'

export type ListButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  selected?: boolean
}

export const ListButton = ({
  className,
  label,
  selected = false,
  ...props
}: ListButtonProps) => (
  <button
    aria-pressed={selected}
    className={clsx(styles.root, selected && styles.selected, className)}
    type="button"
    {...props}
  >
    {label}
  </button>
)
