import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomePagination } from './HomePagination'

describe('HomePagination', () => {
  it('renders arrow buttons for navigation', async () => {
    const user = userEvent.setup()
    const onPageChange = jest.fn()

    render(
      <HomePagination currentPage={2} onPageChange={onPageChange} totalPages={4} />
    )

    expect(screen.getByLabelText('Предыдущая страница')).toBeInTheDocument()
    expect(screen.getByLabelText('Следующая страница')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Предыдущая страница'))
    await user.click(screen.getByLabelText('Следующая страница'))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })
})
