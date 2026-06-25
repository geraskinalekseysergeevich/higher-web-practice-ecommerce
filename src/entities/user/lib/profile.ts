import type { UpdateProfilePayload, User } from '../../../types'
import { getLanguageLabel } from './languageOptions'

export type ProfileFormValues = {
  firstName: string
  lastName: string
  email: string
  notifyByEmail: boolean
  language: string
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value)

export const getProfileDisplayName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  `${user.firstName} ${user.lastName}`.trim()

export const getProfileLanguageLabel = (language?: User['language']) =>
  getLanguageLabel(language)

export const validateProfileFormValues = (
  values: ProfileFormValues
): ProfileFormErrors => {
  const errors: ProfileFormErrors = {}

  if (!values.firstName.trim()) {
    errors.firstName = 'Укажите имя'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Укажите фамилию'
  }

  if (!values.email.trim()) {
    errors.email = 'Укажите email'
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = 'Введите корректный email'
  }

  if (!values.language.trim()) {
    errors.language = 'Выберите язык'
  }

  return errors
}

export const buildProfileUpdatePayload = (
  values: ProfileFormValues
): UpdateProfilePayload => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  email: values.email.trim(),
  notifyByEmail: values.notifyByEmail,
  language: values.language.trim() as User['language'],
})
