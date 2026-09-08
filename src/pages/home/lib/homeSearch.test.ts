import { clearSearchQuery } from './homeSearch'

describe('clearSearchQuery', () => {
  it('removes only the query and resets pagination', () => {
    const params = clearSearchQuery(
      new URLSearchParams('q=усы&category=Классические&style=Винтаж&page=4')
    )

    expect(params.get('q')).toBeNull()
    expect(params.get('category')).toBe('Классические')
    expect(params.get('style')).toBe('Винтаж')
    expect(params.get('page')).toBe('1')
  })
})
