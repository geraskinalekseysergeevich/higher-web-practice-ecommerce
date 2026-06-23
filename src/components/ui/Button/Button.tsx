import clsx from 'clsx'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconOnly?: boolean
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
}

const sizeClassNames: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export const Button = ({
  children,
  className,
  disabled,
  fullWidth = false,
  iconOnly = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        styles.root,
        variantClassNames[variant],
        sizeClassNames[size],
        fullWidth && styles.fullWidth,
        iconOnly && styles.iconOnly,
        className
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
