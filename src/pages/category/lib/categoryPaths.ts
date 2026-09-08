export const decodeParam = (value?: string) => {
  if (!value) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const getCategoryPath = (...parts: string[]) =>
  `/categories/${parts.map((part) => encodeURIComponent(part)).join('/')}`
