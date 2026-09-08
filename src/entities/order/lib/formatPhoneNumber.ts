const PHONE_DIGIT_LIMIT = 10

export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const normalizedDigits = digits.startsWith('8')
    ? `7${digits.slice(1)}`
    : digits
  const subscriberDigits = normalizedDigits.startsWith('7')
    ? normalizedDigits.slice(1)
    : normalizedDigits
  const limitedDigits = subscriberDigits.slice(0, PHONE_DIGIT_LIMIT)

  let formattedValue = '+7'

  if (limitedDigits) {
    formattedValue += ` ${limitedDigits.slice(0, 3)}`
  }

  if (limitedDigits.length > 3) {
    formattedValue += ` ${limitedDigits.slice(3, 6)}`
  }

  if (limitedDigits.length > 6) {
    formattedValue += `-${limitedDigits.slice(6, 8)}`
  }

  if (limitedDigits.length > 8) {
    formattedValue += `-${limitedDigits.slice(8, 10)}`
  }

  return formattedValue
}
