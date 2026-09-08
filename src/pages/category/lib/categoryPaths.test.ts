import { decodeParam, getCategoryPath } from './categoryPaths'

describe('category paths', () => {
  it('decodes route parameters and preserves malformed values', () => {
    expect(decodeParam('%D0%A3%D1%81%D1%8B')).toBe('Усы')
    expect(decodeParam('%')).toBe('%')
    expect(decodeParam()).toBeUndefined()
  })

  it('encodes category path segments', () => {
    expect(getCategoryPath('Усы', 'Классические')).toBe(
      '/categories/%D0%A3%D1%81%D1%8B/%D0%9A%D0%BB%D0%B0%D1%81%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5'
    )
  })
})
