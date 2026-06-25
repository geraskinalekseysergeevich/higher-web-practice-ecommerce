import { Link } from 'react-router-dom'

import { selectAuthenticatedUser } from '../../../app/auth/authSlice'
import { useAppSelector } from '../../../app/hooks'
import LogoFullSvg from '../../../assets/Logo-Full.svg?react'
import { CartIcon, UserIcon } from '../../ui'
import { Search } from '../Search/Search'
import styles from './Header.module.css'

export const Header = () => {
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const isAuthenticated = Boolean(authenticatedUser)
  const profileLabel = authenticatedUser?.firstName ?? 'Профиль'

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/" aria-label="На главную">
          <LogoFullSvg
            aria-hidden="true"
            focusable="false"
            className={styles.brandLogo}
          />
        </Link>

        <Link className={styles.catalogButton} to="/">
          Каталог
        </Link>

        <Search className={styles.search} />

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link className={styles.profile} to="/profile">
                <UserIcon className={styles.profileIcon} />
                <span className={styles.profileName}>{profileLabel}</span>
              </Link>
              <Link className={styles.cart} to="/profile/cart">
                <CartIcon className={styles.cartIcon} />
                <span className={styles.cartName}>Корзина</span>
              </Link>
            </>
          ) : (
            <Link className={styles.registerButton} to="/register">
              Зарегистрироваться
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
