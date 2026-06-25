import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ProfileTabs } from './ProfileTabs'

describe('ProfileTabs', () => {
  it('highlights current profile tab', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProfileTabs />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: 'Мой профиль' })
    ).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'История заказов' })).toHaveAttribute(
      'href',
      '/profile/orders'
    )
    expect(screen.getByRole('link', { name: 'Корзина' })).toHaveAttribute(
      'href',
      '/profile/cart'
    )
  })
})
