import clsx from 'clsx'
import type { SyntheticEvent } from 'react'

import { SearchIcon } from '../../ui'
import styles from './Search.module.css'

type SearchProps = {
  className?: string
  onSubmit?: (event: SyntheticEvent<HTMLFormElement>) => void
}

export const Search = ({ className, onSubmit }: SearchProps) => (
  <form
    className={clsx(styles.root, className)}
    role="search"
    onSubmit={onSubmit ?? ((event) => event.preventDefault())}
  >
    <label className={styles.srOnly} htmlFor="header-search">
      Искать
    </label>
    <input
      className={styles.input}
      id="header-search"
      name="search"
      placeholder="Искать"
      type="search"
    />
    <button className={styles.button} type="submit" aria-label="Найти">
      <SearchIcon className={styles.icon} />
    </button>
  </form>
)
