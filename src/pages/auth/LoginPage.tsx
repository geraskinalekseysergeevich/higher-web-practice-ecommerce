import { Link } from 'react-router-dom'

import { Button, Form, FormField, Input } from '../../components/ui'
import styles from './LoginPage.module.css'

export const LoginPage = () => (
  <Form
    className={styles.card}
    title="Вход в аккаунт"
    onSubmit={(event) => event.preventDefault()}
    footer={
      <div className={styles.footer}>
        <span className={styles.footerText}>У вас ещё нет аккаунта?</span>
        <Link className={styles.footerLink} to="/register">
          Зарегистрироваться
        </Link>
      </div>
    }
  >
    <FormField label="Ваш email или логин">
      <Input
        autoComplete="username"
        name="login"
        placeholder="ivanov@yandex.ru"
      />
    </FormField>

    <FormField label="Пароль">
      <Input
        autoComplete="current-password"
        name="password"
        placeholder="*******"
        type="password"
      />
    </FormField>

    <div className={styles.recovery}>
      <button className={styles.recoveryLink} type="button">
        Забыли пароль?
      </button>
    </div>

    <Button type="submit" fullWidth size="lg">
      Войти
    </Button>
  </Form>
)
