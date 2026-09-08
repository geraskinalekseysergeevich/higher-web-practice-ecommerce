export const formatBreadcrumb = (
  productCategory?: string,
  productSubcategory?: string
) =>
  ['Товарная группа', productCategory, productSubcategory]
    .filter(Boolean)
    .join(' / ')
