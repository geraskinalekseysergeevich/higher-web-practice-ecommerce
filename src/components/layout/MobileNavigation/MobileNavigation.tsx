import { Link, useLocation } from 'react-router-dom'

import { CartIcon, HomeIcon, ListIcon, UserIcon } from '../../ui'
import styles from './MobileNavigation.module.css'

type MobileNavigationProps = {
  isAuthenticated: boolean
}

export const MobileNavigation = ({
  isAuthenticated,
}: MobileNavigationProps) => {
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <nav
        className={`${styles.root} ${styles.guest}`}
        aria-label="Мобильная навигация"
      >
        <Link className={styles.item} to="/login">
          <UserIcon className={styles.icon} />
          <span>Войти</span>
        </Link>
        <Link className={styles.register} to="/register">
          Зарегистрироваться
        </Link>
      </nav>
    )
  }

  const items = [
    { label: 'Главная', path: '/', Icon: HomeIcon },
    { label: 'Товары', path: '/categories', Icon: ListIcon },
    { label: 'Профиль', path: '/profile', Icon: UserIcon },
    { label: 'Корзина', path: '/profile/cart', Icon: CartIcon },
  ]
  const isConfirmationPage = location.pathname.startsWith('/confirmation/')

  return (
    <nav className={styles.root} aria-label="Мобильная навигация">
      {items.map(({ label, path, Icon }) => {
        const isActive =
          path === '/'
            ? location.pathname === path
            : path === '/profile'
              ? location.pathname === path ||
                (location.pathname.startsWith(`${path}/`) &&
                  !location.pathname.startsWith('/profile/cart'))
              : path === '/profile/cart'
                ? isConfirmationPage ||
                  location.pathname === path ||
                  location.pathname.startsWith(`${path}/`)
                : location.pathname === path ||
                  location.pathname.startsWith(`${path}/`)

        return (
          <Link
            key={label}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            to={path}
          >
            <Icon className={styles.icon} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
