export const parsePriceParam = (value: string) => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}
