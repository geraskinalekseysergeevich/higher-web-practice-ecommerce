import type { Product } from '../../../types'
import { getProductCharacteristicEntries } from './getProductCharacteristicEntries'

const product = {
  id: 'product-1',
  name: 'Председатель',
  description: 'First',
  price: 5590,
  images: [],
  characteristics: {
    категория: 'Классические',
    стиль: 'Деловые',
    харизма: 'Выраженная',
  },
  inStock: true,
  rating: 4,
  ratingCount: 1,
  createdAt: '2026-03-01T10:00:00Z',
} as Product

describe('getProductCharacteristicEntries', () => {
  it('returns present characteristics in display order', () => {
    expect(getProductCharacteristicEntries(product)).toEqual([
      { label: 'Категория', value: 'Классические' },
      { label: 'Стиль', value: 'Деловые' },
      { label: 'Харизма', value: 'Выраженная' },
    ])
  })
})
