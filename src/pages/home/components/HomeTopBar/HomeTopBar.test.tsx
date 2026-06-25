import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomeTopBar } from './HomeTopBar'

describe('HomeTopBar', () => {
  it('opens custom dropdowns and applies selected values', async () => {
    const user = userEvent.setup()
    const onSortChange = jest.fn()
    const onViewChange = jest.fn()

    render(
      <HomeTopBar
        onSortChange={onSortChange}
        onViewChange={onViewChange}
        sort="newest"
        view="list"
      />
    )

    await user.click(screen.getByLabelText('Сортировка товаров'))
    expect(
      screen.getByRole('menu', { name: 'Сортировка товаров' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Рейтингу' }))
    expect(onSortChange).toHaveBeenCalledWith('rating')

    await user.click(screen.getByLabelText('Отображение'))
    expect(screen.getByRole('menu', { name: 'Отображение' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Таблицей' }))
    expect(onViewChange).toHaveBeenCalledWith('table')
  })
})
