import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomeSidebar } from './HomeSidebar'

describe('HomeSidebar', () => {
  it('shows subcategories for selected category and allows clearing category filters', async () => {
    const user = userEvent.setup()
    const onCategoryChange = jest.fn()
    const onSubcategoryChange = jest.fn()

    render(
      <HomeSidebar
        categories={['Классические', 'Исторические']}
        densityOptions={['Средняя']}
        hasActiveFilters={true}
        inStockOnly={false}
        maxPrice=""
        minPrice=""
        onCategoryChange={onCategoryChange}
        onClearFilters={jest.fn()}
        onDensityChange={jest.fn()}
        onInStockChange={jest.fn()}
        onMaxPriceChange={jest.fn()}
        onMinPriceChange={jest.fn()}
        onRatedChange={jest.fn()}
        onStyleToggle={jest.fn()}
        onSubcategoryChange={onSubcategoryChange}
        ratedOnly={false}
        selectedCategory="Классические"
        selectedDensity={undefined}
        selectedStyles={[]}
        selectedSubcategory="Деловые"
        styleOptions={['Классический']}
        subcategoriesByCategory={{
          Классические: ['Деловые', 'Повседневные'],
          Исторические: ['XIX век'],
        }}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Все категории' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Классические' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Все подкатегории' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Подкатегория' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Все категории' }))
    await user.click(screen.getByRole('button', { name: 'Повседневные' }))
    await user.click(screen.getByRole('button', { name: 'Все подкатегории' }))

    expect(onCategoryChange).toHaveBeenCalledWith(undefined)
    expect(onSubcategoryChange).toHaveBeenCalledWith('Повседневные')
    expect(onSubcategoryChange).toHaveBeenCalledWith(undefined)
  })
})
