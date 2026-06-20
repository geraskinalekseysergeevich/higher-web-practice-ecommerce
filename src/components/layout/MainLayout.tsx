import clsx from 'clsx'
import { Link, Outlet } from 'react-router-dom'

import styles from './MainLayout.module.css'

export function MainLayout() {
  return (
    <div className={styles.container}>
      <header className={`${styles.header} ${styles.card}`}>
        <Link className={styles.brand} to="/" aria-label="На главную">
          <img
            className={styles.brandLogo}
            src="/favicon.svg"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
          />
          <span className={styles.brandText}>E-commerce</span>
        </Link>

        <nav className={styles.links} aria-label="Основная навигация">
          <Link to="/" className={styles.link}>
            Каталог
          </Link>
          <Link to="/cart" className={styles.link}>
            Корзина
          </Link>
          <Link to="/profile" className={styles.link}>
            Профиль
          </Link>
        </nav>
      </header>

      <div className={clsx(styles.body, styles.card)}>
        <aside
          className={clsx(styles.sidebar, styles.card)}
          aria-label="Разделы приложения"
        >
          <p className={styles.sidebarTitle}>Разделы</p>
          <div className={styles.links}>
            <Link to="/" className={styles.link}>
              Главная
            </Link>
            <Link to="/orders" className={styles.link}>
              История заказов
            </Link>
            <Link to="/checkout" className={styles.link}>
              Оформление
            </Link>
          </div>
        </aside>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
