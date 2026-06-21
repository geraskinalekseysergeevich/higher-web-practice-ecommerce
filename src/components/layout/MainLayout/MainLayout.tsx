import { Outlet } from 'react-router-dom'

import { Header } from '../Header/Header'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  return (
    <div className={styles.root}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
