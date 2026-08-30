import { Link } from 'react-router-dom'

import { Button, CartIcon } from '../../../../components/ui'
import type { Product } from '../../../../types'
import styles from './HomeProductCard.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

type HomeProductCardProps = {
  product: Product
  quantity: number
  onAddToCart: (productId: string) => void
  onDecrease?: () => void
  onIncrease?: () => void
  isAddingToCart?: boolean
  view: 'list' | 'table'
}

export const HomeProductCard = ({
  isAddingToCart = false,
  onAddToCart,
  onDecrease,
  onIncrease,
  product,
  quantity,
  view,
}: HomeProductCardProps) => (
  <article className={styles.root} data-view={view}>
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
        <p className={styles.name}>{product.name}</p>
        {view === 'table' ? (
          <p className={styles.price}>{priceFormatter.format(product.price)} ₽</p>
        ) : null}
      </Link>

    <div className={styles.actions}>
      {view === 'list' ? (
        <p className={styles.price}>{priceFormatter.format(product.price)} ₽</p>
      ) : null}

      {quantity > 0 ? (
        <div
          className={styles.quantity}
          role="group"
          aria-label={`Количество товара ${product.name}`}
        >
          <Button
            className={styles.quantityButton}
            type="button"
            variant="secondary"
            size="sm"
            aria-label={`Уменьшить количество ${product.name}`}
            onClick={onDecrease}
          >
            -
          </Button>
          <span
            className={styles.quantityValue}
            aria-label={`Количество товара ${product.name}`}
          >
            {quantity}
          </span>
          <Button
            className={styles.quantityButton}
            type="button"
            variant="secondary"
            size="sm"
            aria-label={`Увеличить количество ${product.name}`}
            onClick={onIncrease}
          >
            +
          </Button>
        </div>
      ) : (
        <Button
          className={styles.button}
          type="button"
          variant="primary"
          size="md"
          disabled={!product.inStock || isAddingToCart}
          aria-label={
            product.inStock
              ? `Добавить «${product.name}» в корзину`
              : `«${product.name}» нет в наличии`
          }
          onClick={() => onAddToCart(product.id)}
        >
          {product.inStock ? (
            <CartIcon className={styles.cartIcon} />
          ) : (
            'Нет в наличии'
          )}
        </Button>
      )}
    </div>
  </article>
)
