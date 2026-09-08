import { LANGUAGE_LABELS, LANGUAGE_OPTIONS } from './languageOptions'

describe('language options', () => {
  it('exposes localized language labels', () => {
    expect(LANGUAGE_LABELS.ru).toBe('Русский')
    expect(LANGUAGE_LABELS.en).toBe('Английский')
    expect(LANGUAGE_OPTIONS).toContainEqual({
      value: 'ru',
      label: 'Русский',
    })
  })
})
