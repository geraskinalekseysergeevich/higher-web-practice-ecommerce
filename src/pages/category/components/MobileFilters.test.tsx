import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MobileFilters } from './MobileFilters'

const createProps = () => ({
  densityOptions: ['Низкая', 'Средняя', 'Высокая'],
  inStockOnly: false,
  maxPrice: '',
  minPrice: '',
  mode: 'filters' as const,
  ratedOnly: false,
  selectedDensity: 'Средняя',
  selectedStyles: ['Классический'],
  styleOptions: ['Классический', 'Винтаж', 'Театральный'],
  onBack: jest.fn(),
  onDensityChange: jest.fn(),
  onInStockChange: jest.fn(),
  onMaxPriceChange: jest.fn(),
  onMinPriceChange: jest.fn(),
  onOpenStyle: jest.fn(),
  onRatedChange: jest.fn(),
  onStyleToggle: jest.fn(),
  onApply: jest.fn(),
})

describe('MobileFilters', () => {
  it('opens the style state from the filter state', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<MobileFilters {...props} />)
    await user.click(screen.getByRole('button', { name: 'Стиль' }))

    expect(props.onOpenStyle).toHaveBeenCalledTimes(1)
  })

  it('returns to the catalog from the filters state', async () => {
    const user = userEvent.setup()
    const props = createProps()

    render(<MobileFilters {...props} />)

    await user.click(screen.getByRole('button', { name: 'Назад к каталогу' }))

    expect(props.onBack).toHaveBeenCalledTimes(1)
  })

  it('renders style choices and toggles the selected value', async () => {
    const user = userEvent.setup()
    const props = { ...createProps(), mode: 'style' as const }

    render(<MobileFilters {...props} />)
    const vintage = screen.getByRole('checkbox', { name: 'Винтаж' })

    expect(vintage).not.toBeChecked()
    await user.click(vintage)

    expect(props.onStyleToggle).toHaveBeenCalledWith('Винтаж')
  })
})
