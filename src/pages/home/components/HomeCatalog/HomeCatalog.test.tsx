import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { store } from '../../../../app/store'
import type { Product } from '../../../../types'
import { HomeCatalog } from './HomeCatalog'

jest.mock('../../../../app/api/cartApi', () => ({
  useAddToCartMutation: () => [jest.fn()],
  useGetCartQuery: () => ({ data: [] }),
  useRemoveFromCartMutation: () => [jest.fn()],
  useUpdateCartItemMutation: () => [jest.fn()],
}))

const products: Product[] = [
  {
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
  },
]

describe('HomeCatalog', () => {
  it('switches layout for list view', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomeCatalog
            currentPage={1}
            isError={false}
            isLoading={false}
            onClearFilters={jest.fn()}
            onPageChange={jest.fn()}
            products={products}
            totalPages={1}
            view="list"
          />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('home-catalog-grid')).toHaveAttribute(
      'data-view',
      'list'
    )
  })
})
