import type { Product } from '../../../types'

const characteristicOrder = [
  'категория',
  'подкатегория',
  'стиль',
  'форма',
  'густота',
  'закрученность',
  'харизма',
] as const

export const getProductCharacteristicEntries = (product: Product) =>
  characteristicOrder
    .map((key) => ({
      label: key[0].toUpperCase() + key.slice(1),
      value: product.characteristics[key],
    }))
    .filter((item) => Boolean(item.value))
