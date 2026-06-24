import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../Header/Header'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isAuthenticated =
    pathname !== '/' &&
    pathname !== '/login' &&
    pathname !== '/register'

  return (
    <div className={styles.root}>
      <Header isAuthenticated={isAuthenticated} />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
