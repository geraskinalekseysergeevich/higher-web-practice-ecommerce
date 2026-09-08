export const clearSearchQuery = (searchParams: URLSearchParams) => {
  const nextParams = new URLSearchParams(searchParams)
  nextParams.delete('q')
  nextParams.set('page', '1')
  return nextParams
}
