import { formatBreadcrumb } from './formatBreadcrumb'

describe('formatBreadcrumb', () => {
  it('joins available product path segments', () => {
    expect(formatBreadcrumb('Современные', 'Северные')).toBe(
      'Товарная группа / Современные / Северные'
    )
  })

  it('omits missing path segments', () => {
    expect(formatBreadcrumb()).toBe('Товарная группа')
  })
})
