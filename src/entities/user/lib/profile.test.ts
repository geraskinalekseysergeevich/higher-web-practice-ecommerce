import {
  buildProfileUpdatePayload,
  getProfileDisplayName,
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

  it('builds update payload from values', () => {
    expect(
      buildProfileUpdatePayload({
        firstName: '  Иван ',
        lastName: ' Петров ',
        email: ' ivan@example.com ',
        notifyByEmail: true,
        language: 'ru',
      })
    ).toEqual({
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      notifyByEmail: true,
      language: 'ru',
    })
  })
})
