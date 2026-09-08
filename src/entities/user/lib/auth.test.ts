import {
  authenticateUser,
  buildRegisteredUser,
  findUserByEmail,
  hasDuplicateUser,
  normalizeEmail,
  registerUser,
  validateLoginPayload,
  validateRegisterPayload,
} from './auth'

const users = [
  {
    id: 'user-1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    password: '123456',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'user-2',
    firstName: 'Анна',
    lastName: 'Смирнова',
    email: 'anna@example.com',
    password: '654321',
    createdAt: '2026-03-02T10:00:00Z',
  },
]

describe('normalizeEmail', () => {
  it('trims spaces and lowercases email', () => {
    expect(normalizeEmail('  Ivan@Example.Com  ')).toBe('ivan@example.com')
  })
})

describe('hasDuplicateUser', () => {
  it('finds user by email ignoring case', () => {
    expect(hasDuplicateUser(users, 'IVAN@example.com')).toBe(true)
  })
})

describe('findUserByEmail', () => {
  it('returns user by normalized email', () => {
    expect(findUserByEmail(users, ' ANNA@EXAMPLE.COM ')).toEqual(users[1])
  })
})

describe('buildRegisteredUser', () => {
  it('creates stored user without confirmPassword', () => {
    expect(
      buildRegisteredUser(
        {
          firstName: 'Пётр',
          lastName: 'Сидоров',
          email: 'petr@example.com',
          password: 'qwerty',
          confirmPassword: 'qwerty',
        },
        {
          id: 'user-3',
          createdAt: '2026-06-25T10:00:00Z',
        }
      )
    ).toEqual({
      id: 'user-3',
      firstName: 'Пётр',
      lastName: 'Сидоров',
      email: 'petr@example.com',
      password: 'qwerty',
      notifyByEmail: false,
      language: 'ru',
      createdAt: '2026-06-25T10:00:00Z',
    })
  })
})

describe('validateRegisterPayload', () => {
  it('returns required field errors', () => {
    expect(
      validateRegisterPayload({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    ).toEqual({
      firstName: 'Укажите имя',
      lastName: 'Укажите фамилию',
      email: 'Укажите email',
      password: 'Укажите пароль',
      confirmPassword: 'Подтвердите пароль',
    })
  })
})

describe('validateLoginPayload', () => {
  it('returns required field errors', () => {
    expect(
      validateLoginPayload({
        email: '',
        password: '',
      })
    ).toEqual({
      email: 'Укажите email',
      password: 'Укажите пароль',
    })
  })
})

describe('registerUser', () => {
  it('rejects duplicate email', () => {
    expect(
      registerUser(users, {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        password: '123456',
        confirmPassword: '123456',
      })
    ).toEqual({
      error: 'Пользователь с таким email уже существует',
    })
  })
})

describe('authenticateUser', () => {
  it('rejects unknown user', () => {
    expect(
      authenticateUser(users, {
        email: 'unknown@example.com',
        password: '123456',
      })
    ).toEqual({
      error: 'Пользователь не найден',
    })
  })

  it('rejects wrong password', () => {
    expect(
      authenticateUser(users, {
        email: 'ivan@example.com',
        password: 'wrong-password',
      })
    ).toEqual({
      error: 'Неверный пароль',
    })
  })

  it('returns public user on success', () => {
    expect(
      authenticateUser(users, {
        email: 'ivan@example.com',
        password: '123456',
      })
    ).toEqual({
      user: {
        id: 'user-1',
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        createdAt: '2026-03-01T10:00:00Z',
      },
    })
  })
})
