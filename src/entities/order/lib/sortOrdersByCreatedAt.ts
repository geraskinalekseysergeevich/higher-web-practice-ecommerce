type OrderWithCreatedAt = {
  createdAt: string
}

export const sortOrdersByCreatedAt = <T extends OrderWithCreatedAt>(
  orders: T[]
) =>
  [...orders].sort(
    (firstOrder, secondOrder) =>
      new Date(secondOrder.createdAt).getTime() -
      new Date(firstOrder.createdAt).getTime()
  )
