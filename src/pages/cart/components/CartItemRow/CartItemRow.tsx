import { Button } from '../../../../components/ui'
import styles from './CartItemRow.module.css'

type CartItemRowProps = {
  image: string
  name: string
  unitPrice: number
  quantity: number
  totalPrice: number
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
}

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const CartItemRow = ({
  image,
  name,
  unitPrice,
  quantity,
  totalPrice,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemRowProps) => (
  <article className={styles.root}>
    <img className={styles.image} src={image} alt={name} />

    <div className={styles.info}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.price}>{priceFormatter.format(unitPrice)} ₽</p>
      <button className={styles.removeButton} type="button" onClick={onRemove}>
        Удалить
      </button>
    </div>

    <div className={styles.quantity}>
      <Button
        className={styles.quantityButton}
        type="button"
        variant="secondary"
        size="sm"
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
        onClick={onIncrease}
        aria-label={`Увеличить количество товара «${name}»`}
      >
        +
      </Button>
    </div>

    <p className={styles.total}>{priceFormatter.format(totalPrice)} ₽</p>
  </article>
)
