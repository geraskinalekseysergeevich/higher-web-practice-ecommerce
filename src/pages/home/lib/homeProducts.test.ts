import type { Product } from '../../../types'
import { getVisibleHomeProducts } from './homeProducts'

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
    rating: 4.8,
    ratingCount: 8,
    createdAt: '2026-03-03T10:00:00Z',
  },
  {
    id: '2',
    name: 'Beta',
    description: 'Second',
    price: 250,
    images: [],
    characteristics: {
      категория: 'Классические',
      подкатегория: 'Повседневные',
      стиль: 'Военный',
      густота: 'Средняя',
    },
    inStock: true,
    rating: 0,
    ratingCount: 0,
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: '3',
    name: 'Gamma',
    description: 'Third',
    price: 400,
    images: [],
    characteristics: {
      категория: 'Фантазийные',
      подкатегория: 'Сценические',
      стиль: 'Классический',
      густота: 'Высокая',
    },
    inStock: false,
    rating: 4.2,
    ratingCount: 3,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: '4',
    name: 'Delta',
    description: 'Fourth',
    price: 150,
    images: [],
    characteristics: {
      категория: 'Классические',
      подкатегория: 'Деловые',
      стиль: 'Классический',
      густота: 'Средняя',
    },
    inStock: true,
    rating: 3.5,
    ratingCount: 4,
    createdAt: '2026-03-04T10:00:00Z',
  },
]

describe('getVisibleHomeProducts', () => {
  it('filters, sorts and paginates products', () => {
    const result = getVisibleHomeProducts(products, {
      category: 'Классические',
      subcategory: 'Деловые',
      styles: ['Классический'],
      density: 'Средняя',
      inStockOnly: true,
      ratedOnly: true,
      minPrice: 90,
      maxPrice: 200,
      sort: 'newest',
      page: 1,
      pageSize: 10,
    })

    expect(result.total).toBe(2)
    expect(result.totalPages).toBe(1)
    expect(result.items.map((product: Product) => product.id)).toEqual([
      '4',
      '1',
    ])
  })

  it('returns the requested page after sorting', () => {
    const result = getVisibleHomeProducts(products, {
      sort: 'price_desc',
      page: 2,
      pageSize: 2,
    })

    expect(result.total).toBe(4)
    expect(result.totalPages).toBe(2)
    expect(result.items.map((product: Product) => product.id)).toEqual([
      '4',
      '1',
    ])
  })
})
