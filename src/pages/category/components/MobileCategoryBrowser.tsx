import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Search } from '../../../components/layout/Search/Search'
import { getCategoryPath } from '../lib/categoryPaths'
import styles from './MobileCategoryBrowser.module.css'

type MobileCategoryBrowserProps = {
  categories: string[]
  subcategoriesByCategory: Record<string, string[]>
  category?: string
  subcategory?: string
  searchQuery?: string
  rootLabel?: string
  onSearch: (query: string) => void
}

export const MobileCategoryBrowser = ({
  categories,
  category,
  onSearch,
  rootLabel = 'Усы',
  searchQuery = '',
  subcategoriesByCategory,
  subcategory,
}: MobileCategoryBrowserProps) => {
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(
      String(new FormData(event.currentTarget).get('search') ?? '').trim()
    )
  }

  const children = subcategory
    ? (subcategoriesByCategory[subcategory] ?? [])
    : categories
  const title = subcategory ?? category

  return (
    <section className={styles.root} aria-labelledby="mobile-category-title">
      <Search
        compact
        defaultValue={searchQuery}
        onClear={() => onSearch('')}
        onSubmit={handleSearch}
      />

      {!category ? (
        <div className={styles.list}>
          <Link className={styles.item} to={getCategoryPath(rootLabel)}>
            <span>{rootLabel}</span>
            <span className={styles.arrow} aria-hidden="true">
              ›
            </span>
          </Link>
        </div>
      ) : (
        <>
          <Link
            className={styles.back}
            to={subcategory ? getCategoryPath(rootLabel) : '/categories'}
          >
            <span aria-hidden="true">←</span>
            <h1 id="mobile-category-title">{title}</h1>
          </Link>
          <div className={styles.list}>
            {children.map((item) => (
              <Link
                key={item}
                className={styles.item}
                to={getCategoryPath(
                  rootLabel,
                  ...(subcategory ? [subcategory, item] : [item])
                )}
              >
                <span>{item}</span>
                {!subcategory ? (
                  <span className={styles.arrow} aria-hidden="true">
                    ›
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
