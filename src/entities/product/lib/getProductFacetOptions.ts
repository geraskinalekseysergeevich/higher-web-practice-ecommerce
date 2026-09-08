import type { Product } from '../../../types'

type ProductFacetOptions = {
  categories: string[]
  subcategoriesByCategory: Record<string, string[]>
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
  subcategoriesByCategory: getUniqueCharacteristicValues(
    products,
    'категория'
  ).reduce<Record<string, string[]>>((accumulator, category) => {
    const subcategories = products
      .filter((product) => product.characteristics['категория'] === category)
      .flatMap((product) => {
        const value = product.characteristics['подкатегория']

        return value ? [value] : []
      })

    accumulator[category] = Array.from(new Set(subcategories))

    return accumulator
  }, {}),
  styleOptions: getUniqueCharacteristicValues(products, 'стиль'),
  densityOptions: getUniqueCharacteristicValues(products, 'густота'),
})
