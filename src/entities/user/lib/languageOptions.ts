import type { LanguageCode } from '../../../types'

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'Английский',
  es: 'Испанский',
  fr: 'Французский',
  de: 'Немецкий',
  it: 'Итальянский',
  pt: 'Португальский',
  ru: 'Русский',
  zh: 'Китайский',
  ja: 'Японский',
}

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGE_LABELS).map(
  ([value, label]) => ({
    value: value as LanguageCode,
    label,
  })
)

export const getLanguageLabel = (language?: LanguageCode) => {
  if (!language) {
    return 'Не указан'
  }

  return LANGUAGE_LABELS[language]
}
