import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useCreateUserMutation, useGetUsersQuery } from '../../app/api/usersApi'
import {
  Button,
  Form,
  FormField,
  Input,
  ServerError,
} from '../../components/ui'
import {
  registerUser,
  validateRegisterPayload,
} from '../../entities/user/lib/auth'
import { AuthBackButton } from './components/AuthBackButton'
import styles from './RegisterPage.module.css'

type RegisterValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const initialValues: RegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const RegisterPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: users = [], isError, isLoading, refetch } = useGetUsersQuery()
  const [createUser, { isLoading: isSaving }] = useCreateUserMutation()
  const [values, setValues] = useState<RegisterValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterValues, string>>
  >({})
  const [serverError, setServerError] = useState('')

  const handleBack = () => {
    if (location.key === 'default') {
      navigate('/')
      return
    }

    navigate(-1)
  }

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = validateRegisterPayload(values)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    if (isError) {
      return
    }

    const registration = registerUser(users, values)

    if ('error' in registration) {
      setServerError(registration.error)
      return
    }

    try {
      await createUser(values).unwrap()
      navigate('/login', {
        replace: true,
        state: { message: 'Регистрация завершена. Войдите в аккаунт.' },
      })
    } catch {
      setServerError('Не удалось зарегистрировать пользователя')
    }
  }

  return (
    <Form
      className={styles.card}
      title="Регистрация"
      titleAdornment={<AuthBackButton onClick={handleBack} />}
      onSubmit={handleSubmit}
      noValidate
      footer={
        <div className={styles.footer}>
          <span className={styles.footerText}>Уже зарегистрированы?</span>
          <Link className={styles.footerLink} to="/login">
            Войти в аккаунт
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
            message="Не удалось проверить существующие аккаунты."
            onRetry={() => void refetch()}
          />
        ) : null}

        <FormField
          id="register-first-name"
          error={fieldErrors.firstName}
          label="Имя"
          requiredMark
        >
          <Input
            autoComplete="given-name"
            name="firstName"
            id="register-first-name"
            error={fieldErrors.firstName}
            required
            onChange={handleChange}
            placeholder="Ярополк"
            value={values.firstName}
          />
        </FormField>

        <FormField
          id="register-last-name"
          error={fieldErrors.lastName}
          label="Фамилия"
          requiredMark
        >
          <Input
            autoComplete="family-name"
            name="lastName"
            id="register-last-name"
            error={fieldErrors.lastName}
            required
            onChange={handleChange}
            placeholder="Иванов"
            value={values.lastName}
          />
        </FormField>

        <FormField
          id="register-email"
          error={fieldErrors.email}
          label="Email"
          requiredMark
        >
          <Input
            autoComplete="email"
            name="email"
            id="register-email"
            error={fieldErrors.email}
            required
            onChange={handleChange}
            placeholder="ivanov@yandex.ru"
            value={values.email}
          />
        </FormField>

        <FormField
          id="register-password"
          error={fieldErrors.password}
          label="Придумайте пароль"
          requiredMark
        >
          <Input
            autoComplete="new-password"
            name="password"
            id="register-password"
            error={fieldErrors.password}
            required
            onChange={handleChange}
            placeholder="******"
            type="password"
            value={values.password}
          />
        </FormField>

        <FormField
          id="register-confirm-password"
          error={fieldErrors.confirmPassword}
          label="Повторите пароль"
          requiredMark
        >
          <Input
            autoComplete="new-password"
            name="confirmPassword"
            id="register-confirm-password"
            error={fieldErrors.confirmPassword}
            required
            onChange={handleChange}
            placeholder="******"
            type="password"
            value={values.confirmPassword}
          />
        </FormField>
      </div>

      <Button
        disabled={isLoading || isSaving}
        type="submit"
        fullWidth
        size="lg"
      >
        Зарегистрироваться
      </Button>
    </Form>
  )
}
