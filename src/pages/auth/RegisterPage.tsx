import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useCreateUserMutation, useGetUsersQuery } from '../../app/api/usersApi'
import { Button, Form, FormField, Input,ServerError } from '../../components/ui'
import { hasDuplicateUser, registerUser, validateRegisterPayload } from '../../entities/user/lib/auth'
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
  const navigate = useNavigate()
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [createUser, { isLoading: isSaving }] = useCreateUserMutation()
  const [values, setValues] = useState<RegisterValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterValues, string>>
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = validateRegisterPayload(values)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    const registration = registerUser(users, values)

    if ('error' in registration) {
      setServerError(registration.error)
      return
    }

    if (hasDuplicateUser(users, values.email)) {
      setServerError('Пользователь с таким email уже существует')
      return
    }

    try {
      await createUser(values).unwrap()
      navigate('/login', { replace: true })
    } catch {
      setServerError('Не удалось зарегистрировать пользователя')
    }
  }

  return (
    <Form
      className={styles.card}
      title="Регистрация"
      onSubmit={handleSubmit}
      footer={
        <div className={styles.footer}>
          <span className={styles.footerText}>Уже зарегистрированы?</span>
          <Link className={styles.footerLink} to="/login">
            Войти в аккаунт
          </Link>
        </div>
      }
    >
      {serverError ? (
        <ServerError className={styles.serverError} message={serverError} />
      ) : null}

      <FormField
        error={fieldErrors.firstName}
        label="Имя"
        requiredMark
      >
        <Input
          autoComplete="given-name"
          name="firstName"
          onChange={handleChange}
          placeholder="Ярополк"
          value={values.firstName}
        />
      </FormField>

      <FormField
        error={fieldErrors.lastName}
        label="Фамилия"
        requiredMark
      >
        <Input
          autoComplete="family-name"
          name="lastName"
          onChange={handleChange}
          placeholder="Иванов"
          value={values.lastName}
        />
      </FormField>

      <FormField error={fieldErrors.email} label="Email" requiredMark>
        <Input
          autoComplete="email"
          name="email"
          onChange={handleChange}
          placeholder="ivanov@yandex.ru"
          value={values.email}
        />
      </FormField>

      <FormField
        error={fieldErrors.password}
        label="Придумайте пароль"
        requiredMark
      >
        <Input
          autoComplete="new-password"
          name="password"
          onChange={handleChange}
          placeholder="******"
          type="password"
          value={values.password}
        />
      </FormField>

      <FormField
        error={fieldErrors.confirmPassword}
        label="Повторите пароль"
        requiredMark
      >
        <Input
          autoComplete="new-password"
          name="confirmPassword"
          onChange={handleChange}
          placeholder="******"
          type="password"
          value={values.confirmPassword}
        />
      </FormField>

      <Button disabled={isLoading || isSaving} type="submit" fullWidth size="lg">
        Зарегистрироваться
      </Button>
    </Form>
  )
}
