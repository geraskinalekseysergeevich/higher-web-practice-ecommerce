import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { MobileCategoryBrowser } from './MobileCategoryBrowser'

const props = {
  categories: ['Классические', 'Исторические'],
  subcategoriesByCategory: {
    Классические: ['Деловые', 'Повседневные'],
    Исторические: ['XIX век'],
  },
  onSearch: jest.fn(),
}

const LocationProbe = () => {
  const location = useLocation()

  return <output data-testid="location">{location.pathname}</output>
}

describe('MobileCategoryBrowser', () => {
  it('opens the root product category from the initial state', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <MobileCategoryBrowser {...props} />
        <LocationProbe />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: 'Усы' }))

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/categories/%D0%A3%D1%81%D1%8B'
    )
  })

  it('shows category children and links to the next level', () => {
    render(
      <MemoryRouter initialEntries={['/categories/Усы']}>
        <MobileCategoryBrowser {...props} category="Усы" />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Усы' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Классические' })).toHaveAttribute(
      'href',
      '/categories/%D0%A3%D1%81%D1%8B/%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5'
    )
  })

  it('shows subcategories for a selected product category', () => {
    render(
      <MemoryRouter initialEntries={['/categories/Усы/Классические']}>
        <MobileCategoryBrowser
          {...props}
          category="Усы"
          subcategory="Классические"
        />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: 'Классические' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Классические' })).toHaveAttribute(
      'href',
      '/categories/%D0%A3%D1%81%D1%8B'
    )
    expect(screen.getByRole('link', { name: 'Деловые' })).toHaveAttribute(
      'href',
      '/categories/%D0%A3%D1%81%D1%8B/%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5/%D0%94%D0%B5%D0%BB%D0%BE%D0%B2%D1%8B%D0%B5'
    )
  })
})
