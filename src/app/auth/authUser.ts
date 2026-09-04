import type { User } from '../../types'

const languageCodes = new Set([
  'en',
  'es',
  'fr',
  'de',
  'it',
  'pt',
  'ru',
  'zh',
  'ja',
])

export const parseStoredUser = (value: unknown): User | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.firstName !== 'string' ||
    typeof candidate.lastName !== 'string' ||
    typeof candidate.email !== 'string' ||
    typeof candidate.createdAt !== 'string'
  ) {
    return null
  }

  return {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    email: candidate.email,
    phone: typeof candidate.phone === 'string' ? candidate.phone : undefined,
    language: languageCodes.has(String(candidate.language))
      ? (candidate.language as User['language'])
      : undefined,
    notifyByEmail:
      typeof candidate.notifyByEmail === 'boolean'
        ? candidate.notifyByEmail
        : undefined,
    createdAt: candidate.createdAt,
  }
}
