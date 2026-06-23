import type { Product } from '../../../types'

type ProductFacetOptions = {
  categories: string[]
  styleOptions: string[]
  densityOptions: string[]
}

const getUniqueCharacteristicValues = (
  products: Product[],
  key: keyof Product['characteristics']
) => {
  const uniqueValues = new Set<string>()

  products.forEach((product) => {
    const value = product.characteristics[key]

    if (value) {
      uniqueValues.add(value)
    }
  })

  return Array.from(uniqueValues)
}

export const getProductFacetOptions = (
  products: Product[]
): ProductFacetOptions => ({
  categories: getUniqueCharacteristicValues(products, 'категория'),
  styleOptions: getUniqueCharacteristicValues(products, 'стиль'),
  densityOptions: getUniqueCharacteristicValues(products, 'густота'),
})
