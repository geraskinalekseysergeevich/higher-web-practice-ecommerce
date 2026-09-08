export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'zh'
  | 'ja'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  language?: LanguageCode
  notifyByEmail?: boolean
  createdAt: string
}

export type UserProfile = User

export type StoredUser = User & {
  password: string
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type UpdateProfilePayload = {
  firstName?: string
  lastName?: string
  email?: string
  notifyByEmail?: boolean
  language?: LanguageCode
}
