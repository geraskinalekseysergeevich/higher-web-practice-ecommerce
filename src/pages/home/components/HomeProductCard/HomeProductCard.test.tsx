import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import type { Product } from '../../../../types'
import { HomeProductCard } from './HomeProductCard'

const product: Product = {
  id: '1',
  name: 'Alpha',
  description: 'First',
  price: 100,
  images: [],
  characteristics: {},
  inStock: true,
  rating: 4,
  ratingCount: 1,
  createdAt: '2026-03-03T10:00:00Z',
}

describe('HomeProductCard', () => {
  it('shows add button when item is not in cart', () => {
    render(
      <MemoryRouter>
        <HomeProductCard
          isAddingToCart={false}
          onAddToCart={jest.fn()}
          product={product}
          quantity={0}
          view="table"
        />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: 'Добавить «Alpha» в корзину' })
    ).toBeInTheDocument()
  })

  it('shows quantity controls when item is in cart', async () => {
    const user = userEvent.setup()
    const onIncrease = jest.fn()
    const onDecrease = jest.fn()

    render(
      <MemoryRouter>
        <HomeProductCard
          isAddingToCart={false}
          onAddToCart={jest.fn()}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          product={product}
          quantity={2}
          view="list"
        />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('group', { name: 'Количество товара Alpha' })
    ).toHaveTextContent('2')

    await user.click(
      screen.getByRole('button', { name: 'Уменьшить количество Alpha' })
    )
    await user.click(
      screen.getByRole('button', { name: 'Увеличить количество Alpha' })
    )

    expect(onDecrease).toHaveBeenCalled()
    expect(onIncrease).toHaveBeenCalled()
  })
})
