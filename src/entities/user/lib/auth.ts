import type { RegisterPayload, StoredUser, User } from '../../../types'

type BuildRegisteredUserOptions = {
  id?: string
  createdAt?: string
}

export type AuthFormErrors = Partial<{
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}>

const createUserId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `user-${Date.now()}`
}

export const normalizeEmail = (value: string) => value.trim().toLowerCase()

export const hasDuplicateUser = (
  users: Array<Pick<User, 'email'>>,
  email: string
) => {
  const normalizedEmail = normalizeEmail(email)

  return users.some((user) => normalizeEmail(user.email) === normalizedEmail)
}

export const findUserByEmail = <T extends Pick<User, 'email'>>(
  users: T[],
  email: string
) => {
  const normalizedEmail = normalizeEmail(email)

  return users.find((user) => normalizeEmail(user.email) === normalizedEmail)
}

export const buildRegisteredUser = (
  payload: RegisterPayload,
  options: BuildRegisteredUserOptions = {}
): StoredUser => {
  const { confirmPassword, ...body } = payload
  void confirmPassword

  return {
    id: options.id ?? createUserId(),
    ...body,
    notifyByEmail: false,
    language: 'ru',
    createdAt: options.createdAt ?? new Date().toISOString(),
  }
}

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value)

export const validateRegisterPayload = (
  payload: RegisterPayload
): AuthFormErrors => {
  const errors: AuthFormErrors = {}

  if (!payload.firstName.trim()) {
    errors.firstName = 'Укажите имя'
  }

  if (!payload.lastName.trim()) {
    errors.lastName = 'Укажите фамилию'
  }

  if (!payload.email.trim()) {
    errors.email = 'Укажите email'
  } else if (!isValidEmail(normalizeEmail(payload.email))) {
    errors.email = 'Введите корректный email'
  }

  if (!payload.password.trim()) {
    errors.password = 'Укажите пароль'
  } else if (payload.password.trim().length < 6) {
    errors.password = 'Пароль должен быть не короче 6 символов'
  }

  if (!payload.confirmPassword.trim()) {
    errors.confirmPassword = 'Подтвердите пароль'
  } else if (payload.confirmPassword !== payload.password) {
    errors.confirmPassword = 'Пароли не совпадают'
  }

  return errors
}

export const validateLoginPayload = (payload: {
  email: string
  password: string
}): AuthFormErrors => {
  const errors: AuthFormErrors = {}

  if (!payload.email.trim()) {
    errors.email = 'Укажите email'
  } else if (!isValidEmail(normalizeEmail(payload.email))) {
    errors.email = 'Введите корректный email'
  }

  if (!payload.password.trim()) {
    errors.password = 'Укажите пароль'
  }

  return errors
}

type RegisterResult =
  | {
      user: StoredUser
    }
  | {
      error: string
    }

type LoginResult =
  | {
      user: User
    }
  | {
      error: string
    }

export const registerUser = (
  users: StoredUser[],
  payload: RegisterPayload,
  options: BuildRegisteredUserOptions = {}
): RegisterResult => {
  const errors = validateRegisterPayload(payload)

  if (Object.keys(errors).length > 0) {
    return { error: 'Проверьте поля формы' }
  }

  if (hasDuplicateUser(users, payload.email)) {
    return { error: 'Пользователь с таким email уже существует' }
  }

  return {
    user: buildRegisteredUser(payload, options),
  }
}

export const authenticateUser = (
  users: StoredUser[],
  payload: {
    email: string
    password: string
  }
): LoginResult => {
  const errors = validateLoginPayload(payload)

  if (Object.keys(errors).length > 0) {
    return { error: 'Проверьте поля формы' }
  }

  const user = findUserByEmail(users, payload.email)

  if (!user) {
    return { error: 'Пользователь не найден' }
  }

  if (user.password !== payload.password) {
    return { error: 'Неверный пароль' }
  }

  const { password: _password, ...publicUser } = user
  void _password

  return { user: publicUser }
}
