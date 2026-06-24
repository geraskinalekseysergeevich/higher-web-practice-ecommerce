import { Link } from 'react-router-dom'

import { Button, Form, FormField, Input } from '../../components/ui'
import styles from './RegisterPage.module.css'

export const RegisterPage = () => (
  <Form
    className={styles.card}
    title="Регистрация"
    onSubmit={(event) => event.preventDefault()}
    footer={
      <div className={styles.footer}>
        <span className={styles.footerText}>Уже зарегистрированы?</span>
        <Link className={styles.footerLink} to="/login">
          Войти в аккаунт
        </Link>
      </div>
    }
  >
    <FormField label="Имя">
      <Input autoComplete="given-name" name="firstName" placeholder="Ярополк" />
    </FormField>

    <FormField label="Фамилия">
      <Input autoComplete="family-name" name="lastName" placeholder="Иванов" />
    </FormField>

    <FormField label="Email">
      <Input autoComplete="email" name="email" placeholder="ivanov@yandex.ru" />
    </FormField>

    <FormField label="Придумайте пароль">
      <Input
        autoComplete="new-password"
        name="password"
        placeholder="******"
        type="password"
      />
    </FormField>

    <FormField label="Повторите пароль">
      <Input
        autoComplete="new-password"
        name="confirmPassword"
        placeholder="******"
        type="password"
      />
    </FormField>

    <Button type="submit" fullWidth size="lg">
      Зарегистрироваться
    </Button>
  </Form>
)
