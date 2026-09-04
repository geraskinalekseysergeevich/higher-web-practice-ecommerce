import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useLazyFindUserByEmailQuery } from '../../app/api/usersApi'
import {
  saveAuthenticatedUser,
  setAuthenticatedUser,
} from '../../app/auth/authSlice'
import { useAppDispatch } from '../../app/hooks'
import {
  ArrowIcon,
  Button,
  Form,
  FormField,
  Input,
  ServerError,
} from '../../components/ui'
import {
  authenticateUser,
  normalizeEmail,
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
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [findUserByEmail, { isError, isFetching }] =
    useLazyFindUserByEmailQuery()
  const [values, setValues] = useState<LoginValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginValues, string>>
  >({})
  const [serverError, setServerError] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')

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
    setRecoveryMessage('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = validateLoginPayload(values)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    let users

    try {
      users = await findUserByEmail({
        email: normalizeEmail(values.email),
      }).unwrap()
    } catch {
      setServerError('Не удалось выполнить вход. Попробуйте ещё раз.')
      return
    }

    const result = authenticateUser(users, values)

    if ('error' in result) {
      setServerError(result.error)
      return
    }

    dispatch(setAuthenticatedUser(result.user))
    saveAuthenticatedUser(result.user)

    const from = location.state?.from as
      | { pathname?: string; search?: string; hash?: string }
      | undefined
    const returnTo = from?.pathname?.startsWith('/')
      ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
      : '/'

    navigate(returnTo, { replace: true })
  }

  return (
    <Form
      className={styles.card}
      title="Вход в аккаунт"
      titleAdornment={<ArrowIcon className={styles.backIcon} />}
      onSubmit={handleSubmit}
      noValidate
      footer={
        <div className={styles.footer}>
          <span className={styles.footerText}>У вас ещё нет аккаунта?</span>
          <Link className={styles.footerLink} to="/register">
            Зарегистрироваться
          </Link>
        </div>
      }
    >
      <div className={styles.fields}>
        {serverError ? (
          <ServerError className={styles.serverError} message={serverError} />
        ) : null}
        {isError ? (
          <ServerError
            className={styles.serverError}
            message="Не удалось загрузить данные для входа."
            onRetry={() =>
              void findUserByEmail({ email: normalizeEmail(values.email) })
            }
          />
        ) : null}
        {location.state?.message ? (
          <p className={styles.successMessage} role="status">
            {location.state.message}
          </p>
        ) : null}
        {recoveryMessage ? (
          <p className={styles.successMessage} role="status">
            {recoveryMessage}
          </p>
        ) : null}

        <FormField
          id="login-email"
          label="Ваш email"
          requiredMark
          error={fieldErrors.email}
        >
          <Input
            autoComplete="email"
            name="email"
            id="login-email"
            error={fieldErrors.email}
            required
            onChange={handleChange}
            placeholder="ivanov@yandex.ru"
            value={values.email}
          />
        </FormField>

        <FormField
          id="login-password"
          label="Пароль"
          requiredMark
          error={fieldErrors.password}
        >
          <Input
            autoComplete="current-password"
            name="password"
            id="login-password"
            error={fieldErrors.password}
            required
            onChange={handleChange}
            placeholder="*******"
            type="password"
            value={values.password}
          />
          <div className={styles.recovery}>
            <button
              className={styles.recoveryLink}
              type="button"
              onClick={() => setRecoveryMessage('Функция пока недоступна')}
            >
              Забыли пароль?
            </button>
          </div>
        </FormField>
      </div>

      <Button disabled={isFetching} type="submit" fullWidth size="lg">
        Войти
      </Button>
    </Form>
  )
}
