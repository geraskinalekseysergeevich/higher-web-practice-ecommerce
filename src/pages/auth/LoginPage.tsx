import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useGetUsersQuery } from '../../app/api/usersApi'
import { saveAuthenticatedUser,setAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppDispatch } from '../../app/hooks'
import { Button, Form, FormField, Input,ServerError } from '../../components/ui'
import {
  authenticateUser,
  validateLoginPayload,
} from '../../entities/user/lib/auth'
import styles from './LoginPage.module.css'

type LoginValues = {
  email: string
  password: string
}

const initialValues: LoginValues = {
  email: '',
  password: '',
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [values, setValues] = useState<LoginValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginValues, string>>
  >({})
  const [serverError, setServerError] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }))
    setServerError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = validateLoginPayload(values)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    const result = authenticateUser(users, values)

    if ('error' in result) {
      setServerError(result.error)
      return
    }

    dispatch(setAuthenticatedUser(result.user))
    saveAuthenticatedUser(result.user)
    navigate('/', { replace: true })
  }

  return (
    <Form
      className={styles.card}
      title="Вход в аккаунт"
      onSubmit={handleSubmit}
      footer={
        <div className={styles.footer}>
          <span className={styles.footerText}>У вас ещё нет аккаунта?</span>
          <Link className={styles.footerLink} to="/register">
            Зарегистрироваться
          </Link>
        </div>
      }
    >
      {serverError ? (
        <ServerError className={styles.serverError} message={serverError} />
      ) : null}

      <FormField label="Email" requiredMark error={fieldErrors.email}>
        <Input
          autoComplete="email"
          name="email"
          onChange={handleChange}
          placeholder="ivanov@yandex.ru"
          value={values.email}
        />
      </FormField>

      <FormField label="Пароль" requiredMark error={fieldErrors.password}>
        <Input
          autoComplete="current-password"
          name="password"
          onChange={handleChange}
          placeholder="*******"
          type="password"
          value={values.password}
        />
      </FormField>

      <div className={styles.recovery}>
        <button className={styles.recoveryLink} type="button">
          Забыли пароль?
        </button>
      </div>

      <Button disabled={isLoading} type="submit" fullWidth size="lg">
        Войти
      </Button>
    </Form>
  )
}
