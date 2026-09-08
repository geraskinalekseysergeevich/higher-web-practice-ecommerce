import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { Header } from './Header'

jest.mock('../../../app/api/cartApi', () => ({
  useGetCartQuery: () => ({ data: [] }),
}))

jest.mock('../../../app/auth/authSlice', () => ({
  selectAuthenticatedUser: () => undefined,
}))

jest.mock('../../../app/hooks', () => ({
  useAppSelector: () => undefined,
}))

const LocationProbe = () => {
  const location = useLocation()

  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  )
}

describe('Header search', () => {
  it('clears the input without navigating away from the current page', async () => {
    render(
      <MemoryRouter initialEntries={['/product/product-1?q=усы']}>
        <Header />
        <LocationProbe />
      </MemoryRouter>
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Очистить поиск' })
    )

    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/product/product-1?q=усы'
    )
  })
})
