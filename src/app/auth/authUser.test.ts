import { parseStoredUser } from './authUser'

describe('parseStoredUser', () => {
  it('rejects malformed stored values', () => {
    expect(parseStoredUser({ id: 'user-1', password: 'secret' })).toBeNull()
  })

  it('returns only the public user shape', () => {
    expect(
      parseStoredUser({
        id: 'user-1',
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        password: 'secret',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).toEqual({
      id: 'user-1',
      firstName: 'Иван',
      lastName: 'Петров',
      email: 'ivan@example.com',
      phone: undefined,
      language: undefined,
      notifyByEmail: undefined,
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  })
})
