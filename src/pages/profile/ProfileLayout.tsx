import { Outlet } from 'react-router-dom'

import { ProfileTabs } from './components/ProfileTabs'
import styles from './ProfileLayout.module.css'

export const ProfileLayout = () => {
  return (
    <section className={styles.page} aria-label="Профиль">
      <div className={styles.sidebar}>
        <ProfileTabs />
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </section>
  )
}
