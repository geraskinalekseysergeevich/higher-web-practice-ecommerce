import { skipToken } from '@reduxjs/toolkit/query'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '../../app/api/usersApi'
import {
  saveAuthenticatedUser,
  selectAuthenticatedUser,
  setAuthenticatedUser,
} from '../../app/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Button,
  Card,
  FormField,
  Input,
  ServerError,
} from '../../components/ui'
import type { ProfileFormValues } from '../../entities/user/lib/profile'
import {
  buildProfileUpdatePayload,
  hasDuplicateProfileEmail,
  validateProfileFormValues,
} from '../../entities/user/lib/profile'
import { ProfileAvatar } from './components/ProfileAvatar'
import styles from './ProfileEditPage.module.css'

type ProfileValues = ProfileFormValues

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
  password: '',
  notifyByEmail: user?.notifyByEmail ?? false,
  language: user?.language ?? 'ru',
})

export const ProfileEditPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const userId = authenticatedUser?.id
  const {
    data: user,
    isError: isUserError,
    refetch: refetchUser,
  } = useGetUserByIdQuery(userId ?? skipToken)
  const {
    data: users = [],
    isError: isUsersError,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery()
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation()
  const [serverError, setServerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProfileValues, string>>
  >({})
  const [values, setValues] = useState<ProfileValues>(() =>
    createInitialValues(user ?? authenticatedUser ?? undefined)
  )

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

    if (isUsersLoading) {
      setServerError('Подождите, пока загрузится проверка email.')
      return
    }

    if (isUsersError) {
      setServerError('Не удалось проверить email. Нажмите «Повторить».')
      return
    }

    if (hasDuplicateProfileEmail(users, user.id, values.email)) {
      setFieldErrors((current) => ({
        ...current,
        email: 'Пользователь с таким email уже существует',
      }))
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

  if (isUserError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить данные профиля."
          onRetry={() => void refetchUser()}
        />
      </section>
    )
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
      <h1 id="profile-edit-title" className={styles.pageTitle}>
        Мой профиль
      </h1>
      <Card className={styles.card}>
        <div className={styles.hero}>
          <ProfileAvatar editing />
        </div>

        {serverError ? (
          <ServerError
            message={serverError}
            onRetry={() => void refetchUsers()}
          />
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            <FormField
              className={styles.field}
              id="profile-first-name"
              label="Имя"
              error={fieldErrors.firstName}
              requiredMark
            >
              <Input
                autoComplete="given-name"
                name="firstName"
                id="profile-first-name"
                error={fieldErrors.firstName}
                required
                onChange={handleChange}
                value={values.firstName}
              />
            </FormField>

            <FormField
              className={styles.field}
              id="profile-last-name"
              label="Фамилия"
              error={fieldErrors.lastName}
              requiredMark
            >
              <Input
                autoComplete="family-name"
                name="lastName"
                id="profile-last-name"
                error={fieldErrors.lastName}
                required
                onChange={handleChange}
                value={values.lastName}
              />
            </FormField>

            <FormField
              className={styles.field}
              id="profile-email"
              label="Email"
              error={fieldErrors.email}
              requiredMark
            >
              <Input
                autoComplete="email"
                name="email"
                id="profile-email"
                error={fieldErrors.email}
                required
                onChange={handleChange}
                value={values.email}
              />
            </FormField>

            <FormField
              className={styles.field}
              id="profile-password"
              label="Новый пароль"
              error={fieldErrors.password}
            >
              <Input
                autoComplete="new-password"
                name="password"
                id="profile-password"
                error={fieldErrors.password}
                onChange={handleChange}
                placeholder="Оставьте пустым, если не меняете"
                type="password"
                value={values.password}
              />
            </FormField>

            <input type="hidden" name="language" value={values.language} />
            <input
              type="hidden"
              name="notifyByEmail"
              value={String(values.notifyByEmail)}
            />
          </div>

          <div className={styles.actions}>
            <Button
              className={styles.cancel}
              onClick={() => navigate('/profile')}
              type="button"
              variant="secondary"
            >
              Отменить
            </Button>
            <Button disabled={isSaving || isUsersLoading} type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
