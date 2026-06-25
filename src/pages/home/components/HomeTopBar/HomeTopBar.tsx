import { useState } from 'react'

import { ListButton, SelectButton } from '../../../../components/ui'
import type { ProductSort } from '../../../../types'
import styles from './HomeTopBar.module.css'

type HomeViewMode = 'list' | 'table'

type HomeTopBarProps = {
  sort: ProductSort
  view: HomeViewMode
  onSortChange: (sort: ProductSort) => void
  onViewChange: (view: HomeViewMode) => void
}

const sortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: 'Новизне', value: 'newest' },
  { label: 'Цене по возрастанию', value: 'price_asc' },
  { label: 'Цене по убыванию', value: 'price_desc' },
  { label: 'Рейтингу', value: 'rating' },
]

const viewOptions: Array<{ label: string; value: HomeViewMode }> = [
  { label: 'Списком', value: 'list' },
  { label: 'Таблицей', value: 'table' },
]

export const HomeTopBar = ({
  sort,
  view,
  onSortChange,
  onViewChange,
}: HomeTopBarProps) => {
  const [sortOpen, setSortOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? sortOptions[0].label
  const selectedViewLabel =
    viewOptions.find((option) => option.value === view)?.label ?? viewOptions[0].label

  return (
    <div className={styles.root}>
      <h1 id="home-title" className={styles.title}>
        УСЫ
      </h1>

      <div className={styles.toolbar}>
        <div className={styles.dropdown}>
          <SelectButton
            aria-label="Сортировка товаров"
            label={selectedSortLabel}
            onClick={() => {
              setSortOpen((current) => !current)
              setViewOpen(false)
            }}
            open={sortOpen}
          />

          {sortOpen ? (
            <div className={styles.menu} role="menu" aria-label="Сортировка товаров">
              {sortOptions.map((option) => (
                <ListButton
                  key={option.value}
                  label={option.label}
                  onClick={() => {
                    onSortChange(option.value)
                    setSortOpen(false)
                  }}
                  selected={sort === option.value}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.dropdown}>
          <SelectButton
            aria-label="Отображение"
            label={selectedViewLabel}
            onClick={() => {
              setViewOpen((current) => !current)
              setSortOpen(false)
            }}
            open={viewOpen}
          />

          {viewOpen ? (
            <div className={styles.menu} role="menu" aria-label="Отображение">
              {viewOptions.map((option) => (
                <ListButton
                  key={option.value}
                  label={option.label}
                  onClick={() => {
                    onViewChange(option.value)
                    setViewOpen(false)
                  }}
                  selected={view === option.value}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
