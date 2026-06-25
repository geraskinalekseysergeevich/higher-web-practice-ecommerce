import { LANGUAGE_LABELS, LANGUAGE_OPTIONS } from './languageOptions'

describe('language options', () => {
  it('exposes international language labels', () => {
    expect(LANGUAGE_LABELS.ru).toBe('Russian')
    expect(LANGUAGE_LABELS.en).toBe('English')
    expect(LANGUAGE_OPTIONS).toContainEqual({
      value: 'ru',
      label: 'Russian',
    })
  })
})
