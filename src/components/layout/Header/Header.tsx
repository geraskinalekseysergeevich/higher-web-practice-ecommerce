import { Link } from 'react-router-dom'

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
        <img
          className={styles.brandLogo}
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          width="40"
          height="40"
        />
        <span className={styles.brandText}>Quant</span>
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
          <Link className={styles.cartButton} to="/cart" aria-label="Корзина">
            <CartIcon className={styles.cartIcon} />
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
