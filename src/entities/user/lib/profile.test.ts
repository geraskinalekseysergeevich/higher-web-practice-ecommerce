import {
  buildProfileUpdatePayload,
  getProfileDisplayName,
  hasDuplicateProfileEmail,
  validateProfileFormValues,
} from './profile'

describe('profile helpers', () => {
  it('builds display name from user names', () => {
    expect(
      getProfileDisplayName({
        firstName: 'Иван',
        lastName: 'Петров',
      })
    ).toBe('Иван Петров')
  })

  it('returns validation errors for required fields', () => {
    expect(
      validateProfileFormValues({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        notifyByEmail: false,
        language: '',
      })
    ).toEqual({
      firstName: 'Укажите имя',
      lastName: 'Укажите фамилию',
      email: 'Укажите email',
      language: 'Выберите язык',
    })
  })

  it('rejects a short new password', () => {
    expect(
      validateProfileFormValues({
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        password: '123',
        notifyByEmail: false,
        language: 'ru',
      })
    ).toEqual({ password: 'Пароль должен быть не короче 6 символов' })
  })

  it('builds update payload from values', () => {
    expect(
      buildProfileUpdatePayload({
        firstName: '  Иван ',
        lastName: ' Петров ',
        email: ' ivan@example.com ',
        password: ' new-password ',
        notifyByEmail: true,
        language: 'ru',
      })
    ).toEqual({
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      password: 'new-password',
      notifyByEmail: true,
      language: 'ru',
    })
  })

  it('detects an email used by another profile but allows the current email', () => {
    const users = [
      { id: 'user-1', email: 'ivan@example.com' },
      { id: 'user-2', email: 'anna@example.com' },
    ]

    expect(hasDuplicateProfileEmail(users, 'user-1', 'ANNA@example.com')).toBe(
      true
    )
    expect(hasDuplicateProfileEmail(users, 'user-1', 'ivan@example.com')).toBe(
      false
    )
  })
})
