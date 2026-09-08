import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from 'react-router-dom'

import { AuthLayout, MainLayout } from '../components/layout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { CartPage } from '../pages/cart/CartPage'
import { CategoryProductPage } from '../pages/category/CategoryProductPage'
import { CheckoutPage } from '../pages/checkout/CheckoutPage'
import { OrderConfirmationPage } from '../pages/confirmation/OrderConfirmationPage'
import { HomePage } from '../pages/home/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OrderHistoryPage } from '../pages/orders/OrderHistoryPage'
import { ProductPage } from '../pages/product/ProductPage'
import { ProfileEditPage } from '../pages/profile/ProfileEditPage'
import { ProfileLayout } from '../pages/profile/ProfileLayout'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { RequireAuth } from './router/RequireAuth'
import { RequireGuest } from './router/RequireGuest'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categories', element: <CategoryProductPage /> },
      { path: 'categories/:category', element: <CategoryProductPage /> },
      {
        path: 'categories/:category/:subcategory',
        element: <CategoryProductPage />,
      },
      {
        path: 'categories/:category/:subcategory/:productSubcategory',
        element: <CategoryProductPage />,
      },
      { path: 'product/:productId', element: <ProductPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'profile',
            element: <ProfileLayout />,
            children: [
              { index: true, element: <ProfilePage /> },
              { path: 'edit', element: <ProfileEditPage /> },
              { path: 'orders', element: <OrderHistoryPage /> },
              { path: 'cart', element: <CartPage /> },
            ],
          },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'confirmation/:orderId', element: <OrderConfirmationPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
]

const router = createBrowserRouter(routes)

export function AppRouter() {
  return <RouterProvider router={router} />
}
