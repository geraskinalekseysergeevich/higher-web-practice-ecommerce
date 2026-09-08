import { Button, Card } from '../../../../components/ui'
import styles from './CartSummary.module.css'

type CartSummaryProps = {
  totalItems: number
  totalPrice: number
  onCheckout: () => void
  checkoutDisabled?: boolean
}

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const CartSummary = ({
  totalItems,
  totalPrice,
  onCheckout,
  checkoutDisabled = false,
}: CartSummaryProps) => (
  <Card className={styles.root}>
    <div className={styles.heading}>
      <h2 className={styles.title}>Ваша корзина</h2>
      <span className={styles.count}>{totalItems} товара</span>
    </div>

    <p className={styles.total}>{priceFormatter.format(totalPrice)} ₽</p>

    <Button
      fullWidth
      size="lg"
      type="button"
      disabled={checkoutDisabled}
      onClick={onCheckout}
    >
      Оформить заказ
    </Button>
  </Card>
)
