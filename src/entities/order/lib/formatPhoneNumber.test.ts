import { formatPhoneNumber } from './formatPhoneNumber'

describe('formatPhoneNumber', () => {
  it('formats a Russian number with the country code', () => {
    expect(formatPhoneNumber('79991234567')).toBe('+7 999 123-45-67')
  })

  it('normalizes a number entered with the local 8 prefix', () => {
    expect(formatPhoneNumber('89991234567')).toBe('+7 999 123-45-67')
  })

  it('formats a number pasted with separators', () => {
    expect(formatPhoneNumber('+7 (999) 123-45-67')).toBe('+7 999 123-45-67')
  })

  it('limits the subscriber number to ten digits', () => {
    expect(formatPhoneNumber('7999123456789')).toBe('+7 999 123-45-67')
  })

  it('returns an empty string for empty input', () => {
    expect(formatPhoneNumber('')).toBe('')
  })
})
