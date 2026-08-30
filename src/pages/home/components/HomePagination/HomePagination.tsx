import { ArrowIcon } from '../../../../components/ui'
import styles from './HomePagination.module.css'

type HomePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right)
}

export const HomePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: HomePaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  const pages = getPageNumbers(currentPage, totalPages)
  const pageItems = pages.flatMap((page, index) => {
    const previousPage = pages[index - 1]

    return [
      ...(previousPage && page - previousPage > 1
        ? [{ type: 'ellipsis' as const, key: `ellipsis-${page}` }]
        : []),
      { type: 'page' as const, page, key: `page-${page}` },
    ]
  })

  return (
    <nav className={styles.root} aria-label="Пагинация товаров">
      <button
        className={styles.arrow}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <ArrowIcon className={styles.icon} />
      </button>

      <div className={styles.pages}>
        {pageItems.map((item) =>
          item.type === 'ellipsis' ? (
            <span key={item.key} className={styles.ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item.key}
              aria-current={item.page === currentPage ? 'page' : undefined}
              className={`${styles.page} ${item.page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(item.page)}
              type="button"
            >
              {item.page}
            </button>
          )
        )}
      </div>

      <button
        className={styles.arrow}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <ArrowIcon className={styles.icon} flipped />
      </button>

      <label className={styles.goTo}>
        <input
          aria-label="Перейти на страницу"
          className={styles.goToInput}
          defaultValue={currentPage}
          key={currentPage}
          inputMode="numeric"
          max={totalPages}
          min={1}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              const page = Number(event.currentTarget.value)

              if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
                onPageChange(page)
              }
            }
          }}
          type="number"
        />
        <span>Переход на страницу</span>
      </label>
    </nav>
  )
}
