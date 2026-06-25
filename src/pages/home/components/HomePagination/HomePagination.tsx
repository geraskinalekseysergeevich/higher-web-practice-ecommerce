import clsx from 'clsx'

import { ArrowIcon, Button } from '../../../../components/ui'
import styles from './HomePagination.module.css'

type HomePaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])

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

  return (
    <nav className={styles.root} aria-label="Пагинация товаров">
      <Button
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        onClick={() => onPageChange(currentPage - 1)}
        iconOnly
        size="sm"
        variant="secondary"
      >
        <ArrowIcon className={styles.icon} />
      </Button>

      <div className={styles.pages}>
        {pages.map((page) => (
          <Button
            key={page}
            className={clsx(styles.page, page === currentPage && styles.active)}
            onClick={() => onPageChange(page)}
            size="sm"
            variant={page === currentPage ? 'primary' : 'secondary'}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        onClick={() => onPageChange(currentPage + 1)}
        iconOnly
        size="sm"
        variant="secondary"
      >
        <ArrowIcon className={styles.icon} flipped />
      </Button>
    </nav>
  )
}
