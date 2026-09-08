import { Outlet, useLocation } from 'react-router-dom'

import { ProfileTabs } from './components/ProfileTabs'
import styles from './ProfileLayout.module.css'

export const ProfileLayout = () => {
  const location = useLocation()
  const isCart = location.pathname === '/profile/cart'
  const isOrders = location.pathname === '/profile/orders'

  return (
    <section
      className={`${styles.page} ${isCart ? styles.cartPage : ''} ${isOrders ? styles.ordersPage : ''}`}
      aria-label="Профиль"
    >
      <div className={styles.sidebar}>
        <ProfileTabs />
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </section>
  )
}
