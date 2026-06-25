import { Outlet } from 'react-router-dom'

import { selectIsAuthenticated } from '../../../app/auth/authSlice'
import { useAppSelector } from '../../../app/hooks'
import { Header } from '../Header/Header'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <div className={styles.root}>
      <Header isAuthenticated={isAuthenticated} />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
