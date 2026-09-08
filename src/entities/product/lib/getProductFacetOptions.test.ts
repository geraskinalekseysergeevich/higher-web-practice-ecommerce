import type { Product } from '../../../types'
import { getProductFacetOptions } from './getProductFacetOptions'

const products: Product[] = [
  {
    id: '1',
    name: 'Alpha',
    description: 'First',
    price: 100,
    images: [],
    characteristics: {
      категория: 'Классические',
      подкатегория: 'Деловые',
      стиль: 'Классический',
      густота: 'Средняя',
    },
    inStock: true,
    rating: 4,
    ratingCount: 1,
    createdAt: '2026-03-03T10:00:00Z',
  },
  {
    id: '2',
    name: 'Beta',
    description: 'Second',
    price: 200,
    images: [],
    characteristics: {
      категория: 'Классические',
      подкатегория: 'Повседневные',
      стиль: 'Военный',
      густота: 'Средняя',
    },
    inStock: true,
    rating: 4,
    ratingCount: 1,
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: '3',
    name: 'Gamma',
    description: 'Third',
    price: 300,
    images: [],
    characteristics: {
      категория: 'Исторические',
      подкатегория: 'XIX век',
      стиль: 'Винтаж',
      густота: 'Высокая',
    },
    inStock: true,
    rating: 5,
    ratingCount: 2,
    createdAt: '2026-03-01T10:00:00Z',
  },
]

describe('getProductFacetOptions', () => {
  it('groups subcategories by category', () => {
    expect(getProductFacetOptions(products)).toEqual({
      categories: ['Классические', 'Исторические'],
      subcategoriesByCategory: {
        Классические: ['Деловые', 'Повседневные'],
        Исторические: ['XIX век'],
      },
      styleOptions: ['Классический', 'Военный', 'Винтаж'],
      densityOptions: ['Средняя', 'Высокая'],
    })
  })
})
