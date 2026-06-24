import { Button, Card } from '../../../../components/ui'
import styles from './CartSummary.module.css'

type CartSummaryProps = {
  totalItems: number
  totalPrice: number
  onCheckout: () => void
}

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const CartSummary = ({
  totalItems,
  totalPrice,
  onCheckout,
}: CartSummaryProps) => (
  <Card className={styles.root}>
    <h2 className={styles.title}>Итого</h2>

    <dl className={styles.totals}>
      <div className={styles.row}>
        <dt className={styles.term}>Товаров</dt>
        <dd className={styles.value}>{totalItems}</dd>
      </div>
      <div className={styles.row}>
        <dt className={styles.term}>Сумма</dt>
        <dd className={styles.value}>
          {priceFormatter.format(totalPrice)} ₽
        </dd>
      </div>
    </dl>

    <Button fullWidth size="lg" type="button" onClick={onCheckout}>
      Оформить заказ
    </Button>
  </Card>
)
