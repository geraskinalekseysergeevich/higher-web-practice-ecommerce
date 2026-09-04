import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Search } from './Search'

describe('Search', () => {
  it('renders compact mobile search without the submit button', () => {
    render(<Search compact />)

    expect(
      screen.getByRole('searchbox', { name: 'Искать' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Найти' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('search')).toHaveClass('compact')
  })

  it('clears a populated search and notifies the owner', async () => {
    const onClear = jest.fn()

    render(<Search defaultValue="усы" onClear={onClear} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Очистить поиск' })
    )

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
