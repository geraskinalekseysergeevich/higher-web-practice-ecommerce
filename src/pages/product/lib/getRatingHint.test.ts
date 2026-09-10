import { getRatingHint } from './getRatingHint'

describe('getRatingHint', () => {
  it('tells the user when a rating has already been submitted', () => {
    expect(getRatingHint(true, true)).toBe('Вы уже поставили оценку.')
  })

  it('keeps the delivery hint before the first rating', () => {
    expect(getRatingHint(true, false)).toBe(
      'Оценка доступна после получения заказа.'
    )
  })

  it('asks guests to sign in before rating', () => {
    expect(getRatingHint(false, false)).toBe(
      'Войдите, чтобы оценить товар после покупки.'
    )
  })
})
