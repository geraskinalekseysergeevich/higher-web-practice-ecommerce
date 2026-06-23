import { Link } from 'react-router-dom'

import { Button, CartIcon } from '../../../../components/ui'
import type { Product } from '../../../../types'
import styles from './HomeProductCard.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

type HomeProductCardProps = {
  product: Product
}

export const HomeProductCard = ({ product }: HomeProductCardProps) => (
  <article className={styles.root}>
    <Link
      className={styles.link}
      to={`/product/${product.id}`}
      aria-label={`Открыть товар «${product.name}»`}
    >
      <img
        className={styles.image}
        src={product.images[0] ?? '/favicon.svg'}
        alt={product.name}
        loading="lazy"
      />
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>{priceFormatter.format(product.price)} ₽</p>
      </div>
    </Link>

    <Button
      className={styles.button}
      type="button"
      variant="primary"
      size="md"
      fullWidth
      aria-label={`Добавить «${product.name}» в корзину`}
    >
      <CartIcon className={styles.cartIcon} />
    </Button>
  </article>
)
