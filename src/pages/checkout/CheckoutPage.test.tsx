import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CheckoutPage } from './CheckoutPage'

jest.mock('../../app/api/cartApi', () => ({
  useGetCartQuery: () => ({
    data: [
      { id: 'cart-1', userId: 'user-1', productId: 'product-1', quantity: 1 },
    ],
    isError: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
  useRemoveFromCartMutation: () => [jest.fn()],
}))

jest.mock('../../app/api/ordersApi', () => ({
  useCreateOrderMutation: () => [jest.fn(), { isLoading: false }],
}))

jest.mock('../../app/api/pickupPointsApi', () => ({
  useGetPickupPointsQuery: () => ({
    data: [],
    isError: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
}))

jest.mock('../../app/api/productsApi', () => ({
  useGetAllProductsQuery: () => ({
    data: [
      {
        id: 'product-1',
        name: 'Председатель',
        description: 'First',
        price: 5590,
        images: [],
        characteristics: {},
        inStock: true,
        rating: 4,
        ratingCount: 1,
        createdAt: '2026-03-03T10:00:00Z',
      },
    ],
    isError: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
}))

jest.mock('../../app/api/usersApi', () => ({
  useGetUserByIdQuery: () => ({
    data: {
      id: 'user-1',
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      createdAt: '2026-03-01T10:00:00Z',
    },
    isError: false,
    isLoading: false,
    refetch: jest.fn(),
  }),
}))

jest.mock('../../app/auth/authSlice', () => ({
  selectAuthenticatedUser: () => ({ id: 'user-1' }),
}))

jest.mock('../../app/hooks', () => ({
  useAppSelector: (selector: () => { id: string }) => selector(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

describe('CheckoutPage validation feedback', () => {
  it('clears a phone error when a valid number is entered', async () => {
    const user = userEvent.setup()

    render(<CheckoutPage />)

    const phoneInput = screen.getByRole('textbox', { name: 'Телефон *' })
    await user.click(screen.getByRole('button', { name: 'Подтвердить заказ' }))

    expect(screen.getByText('Укажите телефон')).toBeInTheDocument()
    expect(phoneInput).toHaveAttribute('aria-invalid', 'true')

    await user.type(phoneInput, '9854806003')

    expect(screen.queryByText('Укажите телефон')).not.toBeInTheDocument()
    expect(phoneInput).toHaveAttribute('aria-invalid', 'false')
  })
})
