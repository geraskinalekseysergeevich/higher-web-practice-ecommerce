import { Link } from 'react-router-dom'

import { Button, TrashIcon } from '../../../../components/ui'
import styles from './CartItemRow.module.css'

type CartItemRowProps = {
  image: string
  isMissing?: boolean
  inStock: boolean
  name: string
  productId: string
  unitPrice: number
  quantity: number
  totalPrice: number
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
  disabled?: boolean
}

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const CartItemRow = ({
  image,
  isMissing = false,
  inStock,
  name,
  productId,
  unitPrice,
  quantity,
  totalPrice,
  onDecrease,
  onIncrease,
  onRemove,
  disabled = false,
}: CartItemRowProps) => (
  <article className={styles.root}>
    <img
      className={styles.image}
      src={image || '/product-placeholder.svg'}
      alt={name}
      onError={(event) => {
        event.currentTarget.src = '/product-placeholder.svg'
      }}
    />

    <div className={styles.info}>
      <h2 className={styles.name}>
        {isMissing ? name : <Link to={`/product/${productId}`}>{name}</Link>}
      </h2>
      <p className={styles.price}>{priceFormatter.format(unitPrice)} ₽</p>
      {!inStock ? (
        <p className={styles.unavailable}>
          {isMissing ? 'Товар больше недоступен' : 'Нет в наличии'}
        </p>
      ) : null}
    </div>

    <div className={styles.quantity}>
      <Button
        className={styles.quantityButton}
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={onDecrease}
        aria-label={`Уменьшить количество товара «${name}»`}
      >
        −
      </Button>

      <span className={styles.quantityValue}>{quantity}</span>

      <Button
        className={styles.quantityButton}
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || !inStock}
        onClick={onIncrease}
        aria-label={`Увеличить количество товара «${name}»`}
      >
        +
      </Button>
    </div>

    <p className={styles.total}>{priceFormatter.format(totalPrice)} ₽</p>

    <button
      className={styles.removeButton}
      type="button"
      disabled={disabled}
      onClick={onRemove}
      aria-label={`Удалить товар «${name}»`}
    >
      <TrashIcon />
    </button>
  </article>
)
