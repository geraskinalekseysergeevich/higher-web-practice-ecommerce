import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { MobileNavigation } from './MobileNavigation'

describe('MobileNavigation', () => {
  it('renders login and registration actions for a guest', () => {
    render(
      <MemoryRouter>
        <MobileNavigation isAuthenticated={false} />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('navigation', { name: 'Мобильная навигация' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveAttribute(
      'href',
      '/login'
    )
    expect(
      screen.getByRole('link', { name: 'Зарегистрироваться' })
    ).toHaveAttribute('href', '/register')
    expect(
      screen.queryByRole('link', { name: 'Главная' })
    ).not.toBeInTheDocument()
  })

  it('renders four storefront destinations for an authenticated user', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <MobileNavigation isAuthenticated />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('link', { name: 'Товары' })).toHaveAttribute(
      'href',
      '/categories'
    )
    expect(screen.getByRole('link', { name: 'Профиль' })).toHaveAttribute(
      'href',
      '/profile'
    )
    expect(screen.getByRole('link', { name: 'Корзина' })).toHaveAttribute(
      'href',
      '/profile/cart'
    )
  })

  it('marks only the cart destination as active on the cart page', () => {
    render(
      <MemoryRouter initialEntries={['/profile/cart']}>
        <MobileNavigation isAuthenticated />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Корзина' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('link', { name: 'Профиль' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('marks the profile destination as active on the order history page', () => {
    render(
      <MemoryRouter initialEntries={['/profile/orders']}>
        <MobileNavigation isAuthenticated />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Профиль' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('link', { name: 'Корзина' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('keeps only the cart destination active after checkout', () => {
    render(
      <MemoryRouter initialEntries={['/confirmation/order-1']}>
        <MobileNavigation isAuthenticated />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Корзина' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('link', { name: 'Профиль' })).not.toHaveAttribute(
      'aria-current'
    )
  })
})
