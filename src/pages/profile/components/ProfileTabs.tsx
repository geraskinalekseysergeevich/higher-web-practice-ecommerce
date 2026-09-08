import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import styles from './ProfileTabs.module.css'

type ProfileTab = {
  label: string
  to: string
  end?: boolean
}

const tabs: ProfileTab[] = [
  { label: 'Мой профиль', to: '/profile', end: true },
  { label: 'История заказов', to: '/profile/orders' },
  { label: 'Корзина', to: '/profile/cart' },
]

export const ProfileTabs = () => {
  return (
    <nav className={styles.root} aria-label="Навигация по профилю">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          className={({ isActive }) =>
            clsx(styles.link, isActive && styles.active)
          }
          end={tab.end}
          to={tab.to}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
