import { Outlet } from 'react-router-dom'

import { selectIsAuthenticated } from '../../../app/auth/authSlice'
import { useAppSelector } from '../../../app/hooks'
import runnerImage from '../../../assets/runner.png'
import { Header } from '../Header/Header'
import styles from './AuthLayout.module.css'

export const AuthLayout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <div className={styles.root}>
      <Header isAuthenticated={isAuthenticated} />

      <main className={styles.main}>
        <img className={styles.illustration} src={runnerImage} alt="" />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
