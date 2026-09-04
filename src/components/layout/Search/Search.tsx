import clsx from 'clsx'
import type {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
} from 'react'
import { useId, useState } from 'react'

import { SearchIcon } from '../../ui'
import styles from './Search.module.css'

type SearchProps = {
  className?: string
  compact?: boolean
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onClear?: () => void
  onSubmit?: FormEventHandler<HTMLFormElement>
}

export const Search = ({
  className,
  compact = false,
  defaultValue,
  onChange,
  onClear,
  onSubmit,
}: SearchProps) => {
  const inputId = useId()
  const [value, setValue] = useState(defaultValue ?? '')
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && compact) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form
      className={clsx(styles.root, compact && styles.compact, className)}
      role="search"
      onSubmit={onSubmit ?? ((event) => event.preventDefault())}
    >
      {compact ? <SearchIcon className={styles.compactIcon} /> : null}
      <label className={styles.srOnly} htmlFor={inputId}>
        Искать
      </label>
      <input
        className={styles.input}
        value={value}
        id={inputId}
        name="search"
        onChange={(event) => {
          setValue(event.currentTarget.value)
          onChange?.(event)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Искать"
        type="search"
      />
      {value ? (
        <button
          className={styles.clear}
          type="button"
          aria-label="Очистить поиск"
          onClick={() => {
            setValue('')
            onClear?.()
          }}
        >
          ×
        </button>
      ) : null}
      {compact ? null : (
        <button className={styles.button} type="submit" aria-label="Найти">
          <SearchIcon className={styles.icon} />
        </button>
      )}
    </form>
  )
}
