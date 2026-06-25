import { Outlet } from 'react-router-dom'

import runnerImage from '../../../assets/runner.png'
import { Header } from '../Header/Header'
import styles from './AuthLayout.module.css'

export const AuthLayout = () => {
  return (
    <div className={styles.root}>
      <Header />

      <main className={styles.main}>
        <img className={styles.illustration} src={runnerImage} alt="" />
        <div className={styles.outlet}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
