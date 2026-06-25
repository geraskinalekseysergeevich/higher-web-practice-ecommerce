import type { LanguageCode } from '../../../types'

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
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
