import { skipToken } from '@reduxjs/toolkit/query'
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetUserByIdQuery, useUpdateUserMutation } from '../../app/api/usersApi'
import {
  saveAuthenticatedUser,
  selectAuthenticatedUser,
  setAuthenticatedUser,
} from '../../app/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
  Select,
  ServerError,
} from '../../components/ui'
import { LANGUAGE_OPTIONS } from '../../entities/user/lib/languageOptions'
import {
  buildProfileUpdatePayload,
  validateProfileFormValues,
} from '../../entities/user/lib/profile'
import { ProfileAvatar } from './components/ProfileAvatar'
import styles from './ProfileEditPage.module.css'

type ProfileValues = {
  firstName: string
  lastName: string
  email: string
  notifyByEmail: boolean
  language: string
}

const createInitialValues = (user?: {
  firstName: string
  lastName: string
  email: string
  notifyByEmail?: boolean
  language?: string
}): ProfileValues => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  notifyByEmail: user?.notifyByEmail ?? false,
  language: user?.language ?? 'ru',
})

export const ProfileEditPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const userId = authenticatedUser?.id
  const { data: user } = useGetUserByIdQuery(userId ?? skipToken)
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation()
  const [serverError, setServerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProfileValues, string>>
  >({})
  const [values, setValues] = useState<ProfileValues>(() =>
    createInitialValues(user)
  )

  useEffect(() => {
    setValues(createInitialValues(user))
  }, [user])

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target
    const fieldName = name as keyof ProfileValues

    setValues((current) => ({
      ...current,
      [name]:
        type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [fieldName]: undefined,
    }))
    setServerError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors = validateProfileFormValues(values)
    setFieldErrors(nextFieldErrors)

    if (!user || Object.keys(nextFieldErrors).length > 0) {
      return
    }

    try {
      const updatedUser = await updateUser({
        userId: user.id,
        payload: buildProfileUpdatePayload(values),
      }).unwrap()

      const { password: _password, ...publicUser } = updatedUser
      void _password

      dispatch(setAuthenticatedUser(publicUser))
      saveAuthenticatedUser(publicUser)
      navigate('/profile', { replace: true })
    } catch {
      setServerError('Не удалось сохранить профиль')
    }
  }

  if (!user) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем данные профиля...</p>
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="profile-edit-title">
      <Card className={styles.card}>
        <div className={styles.hero}>
          <ProfileAvatar editing />

          <div className={styles.header}>
            <p className={styles.eyebrow}>Мой профиль</p>
            <h1 id="profile-edit-title" className={styles.title}>
              Редактирование профиля
            </h1>
          </div>
        </div>

        {serverError ? <ServerError message={serverError} /> : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <FormField label="Имя" requiredMark error={fieldErrors.firstName}>
              <Input
                autoComplete="given-name"
                name="firstName"
                onChange={handleChange}
                value={values.firstName}
              />
            </FormField>

            <FormField label="Фамилия" requiredMark error={fieldErrors.lastName}>
              <Input
                autoComplete="family-name"
                name="lastName"
                onChange={handleChange}
                value={values.lastName}
              />
            </FormField>

            <FormField label="Email" requiredMark error={fieldErrors.email}>
              <Input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                value={values.email}
              />
            </FormField>

            <Checkbox
              checked={values.notifyByEmail}
              label="Уведомлять об изменении статуса заказов по почте"
              name="notifyByEmail"
              onChange={handleChange}
            />

            <FormField
              label="Язык"
              requiredMark
              error={fieldErrors.language}
            >
              <Select
                name="language"
                onChange={handleChange}
                value={values.language}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className={styles.actions}>
            <Button disabled={isSaving} type="submit" size="lg">
              Сохранить изменения
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
