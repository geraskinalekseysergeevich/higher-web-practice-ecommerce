import { Link } from 'react-router-dom'

import LogoFullSvg from '../../../assets/Logo-Full.svg?react'
import { CartIcon, UserIcon } from '../../ui'
import { Search } from '../Search/Search'
import styles from './Header.module.css'

type HeaderProps = {
  isAuthenticated?: boolean
}

export const Header = ({ isAuthenticated = false }: HeaderProps) => (
  <header className={styles.root}>
    <div className={styles.inner}>
      <Link className={styles.brand} to="/" aria-label="На главную">
        <LogoFullSvg aria-hidden="true" focusable="false" className={styles.brandLogo} />
      </Link>

      <button className={styles.catalogButton} type="button">
        Каталог
      </button>

      <Search className={styles.search} />

      <div className={styles.actions}>
        <Link className={styles.profile} to="/profile">
          <UserIcon className={styles.profileIcon} />
          <span className={styles.profileName}>Имя профиля</span>
        </Link>
        {isAuthenticated ? (
          <Link className={styles.cart} to="/cart">
            <CartIcon className={styles.cartIcon} />
            <span className={styles.cartName}>Корзина</span>
          </Link>
        ) : (
          <Link className={styles.registerButton} to="/register">
            Зарегистрироваться
          </Link>
        )}
      </div>
    </div>
  </header>
)
