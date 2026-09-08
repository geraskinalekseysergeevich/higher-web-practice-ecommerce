import { skipToken } from '@reduxjs/toolkit/query'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useGetCartQuery } from '../../../app/api/cartApi'
import { selectAuthenticatedUser } from '../../../app/auth/authSlice'
import { useAppSelector } from '../../../app/hooks'
import LogoFullSvg from '../../../assets/Logo-Full.svg?react'
import { getCartItemCount } from '../../../entities/cart/lib/getCartItemCount'
import { CartIcon, UserIcon } from '../../ui'
import { Search } from '../Search/Search'
import styles from './Header.module.css'

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const isAuthenticated = Boolean(authenticatedUser)
  const profileLabel = authenticatedUser?.firstName ?? 'Профиль'
  const searchQuery = new URLSearchParams(location.search).get('q') ?? ''
  const { data: cartItems = [] } = useGetCartQuery(
    authenticatedUser?.id ?? skipToken
  )
  const cartItemCount = getCartItemCount(cartItems)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = String(
      new FormData(event.currentTarget).get('search') ?? ''
    ).trim()
    const params = new URLSearchParams()

    if (query) {
      params.set('q', query)
    }

    navigate(`/?${params.toString()}`)
  }

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.primary}>
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
        </div>

        <Search
          className={styles.search}
          key={`${location.pathname}${location.search}`}
          defaultValue={searchQuery}
          onSubmit={handleSearch}
        />

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link className={styles.profile} to="/profile">
                <UserIcon className={styles.profileIcon} />
                <span className={styles.profileName}>{profileLabel}</span>
              </Link>
              <Link className={styles.cart} to="/profile/cart">
                <span className={styles.cartVisual}>
                  <CartIcon className={styles.cartIcon} />
                  {cartItemCount > 0 ? (
                    <span className={styles.cartBadge}>{cartItemCount}</span>
                  ) : null}
                </span>
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
