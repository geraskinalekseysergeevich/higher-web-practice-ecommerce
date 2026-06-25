import clsx from 'clsx'

import styles from './ServerError.module.css'

export type ServerErrorProps = {
  message: string
  className?: string
}

export const ServerError = ({ className, message }: ServerErrorProps) => {
  return (
    <div className={clsx(styles.root, className)} role="alert">
      <strong className={styles.title}>Ошибка</strong>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
