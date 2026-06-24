import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../Header/Header'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isAuthenticated = [
    '/product',
    '/profile',
    '/orders',
    '/cart',
    '/checkout',
    '/confirmation',
  ].some((path) => pathname.startsWith(path))

  return (
    <div className={styles.root}>
      <Header isAuthenticated={isAuthenticated} />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
