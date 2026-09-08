import { Outlet } from 'react-router-dom'

import { selectAuthenticatedUser } from '../../../app/auth/authSlice'
import { useAppSelector } from '../../../app/hooks'
import { Header } from '../Header/Header'
import { MobileNavigation } from '../MobileNavigation/MobileNavigation'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const isAuthenticated = Boolean(useAppSelector(selectAuthenticatedUser))

  return (
    <div className={styles.root}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <MobileNavigation isAuthenticated={isAuthenticated} />
    </div>
  )
}
