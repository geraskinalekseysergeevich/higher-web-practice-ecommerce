export const getRatingHint = (
  isAuthenticated: boolean,
  hasExistingRating: boolean
) => {
  if (!isAuthenticated) {
    return 'Войдите, чтобы оценить товар после покупки.'
  }

  if (hasExistingRating) {
    return 'Вы уже поставили оценку.'
  }

  return 'Оценка доступна после получения заказа.'
}
