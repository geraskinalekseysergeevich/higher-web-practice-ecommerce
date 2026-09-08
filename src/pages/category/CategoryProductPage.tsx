import { useParams } from 'react-router-dom'

import { HomePage } from '../home/HomePage'

const decodeParam = (value?: string) => {
  if (!value) {
    return undefined
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const CategoryProductPage = () => {
  const { category, subcategory } = useParams()

  return (
    <HomePage
      category={decodeParam(category)}
      categoryView
      subcategory={decodeParam(subcategory)}
    />
  )
}
