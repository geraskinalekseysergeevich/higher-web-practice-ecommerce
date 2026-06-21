import { Button, Card, Form, FormField, Input, SectionHeading } from '../../components/ui'
import styles from './CheckoutPage.module.css'

export function CheckoutPage() {
  return (
    <div className={styles.root}>
      <Form
        description="Каркас страницы оформления заказа без расчёта и API-логики."
        onSubmit={(event) => event.preventDefault()}
        title="Оформление заказа"
      >
        <FormField label="Телефон" requiredMark>
          <Input autoComplete="tel" name="phone" placeholder="+7 999 123-45-67" />
        </FormField>

        <Card>
          <SectionHeading
            description="Пока только структурная заглушка для будущих переключателей."
            title="Оплата"
          />
        </Card>

        <Card>
          <SectionHeading
            description="Пока только структурная заглушка для будущего выбора адреса."
            title="Доставка"
          />
        </Card>

        <Button type="submit">Подтвердить заказ</Button>
      </Form>
    </div>
  )
}
