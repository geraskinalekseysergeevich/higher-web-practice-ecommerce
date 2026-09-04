import clsx from 'clsx'

import styles from './ServerError.module.css'

export type ServerErrorProps = {
  message: string
  className?: string
  onRetry?: () => void
}

export const ServerError = ({
  className,
  message,
  onRetry,
}: ServerErrorProps) => {
  return (
    <div className={clsx(styles.root, className)} role="alert">
      <strong className={styles.title}>Ошибка</strong>
      <p className={styles.message}>{message}</p>
      {onRetry ? (
        <button className={styles.retry} type="button" onClick={onRetry}>
          Повторить
        </button>
      ) : null}
    </div>
  )
}
