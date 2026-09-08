import { skipToken } from '@reduxjs/toolkit/query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../app/api/usersApi'
import {
  saveAuthenticatedUser,
  selectAuthenticatedUser,
  setAuthenticatedUser,
} from '../../app/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Card, DropdownIcon, ServerError, Switch } from '../../components/ui'
import { LANGUAGE_OPTIONS } from '../../entities/user/lib/languageOptions'
import { getProfileDisplayName } from '../../entities/user/lib/profile'
import type { LanguageCode } from '../../types'
import { ProfileAvatar } from './components/ProfileAvatar'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const dispatch = useAppDispatch()
  const userId = authenticatedUser?.id
  const {
    data: user,
    isError,
    refetch,
  } = useGetUserByIdQuery(userId ?? skipToken)
  const [updateUser, { isLoading: isSavingPreferences }] =
    useUpdateUserMutation()
  const [serverError, setServerError] = useState('')
  const language: LanguageCode = user?.language ?? 'ru'
  const notifyByEmail = user?.notifyByEmail ?? false

  const savePreference = async (payload: {
    language?: typeof language
    notifyByEmail?: boolean
  }) => {
    if (!user) {
      return
    }

    setServerError('')

    try {
      const updatedUser = await updateUser({
        userId: user.id,
        payload,
      }).unwrap()
      const { password: _password, ...publicUser } = updatedUser
      void _password

      dispatch(setAuthenticatedUser(publicUser))
      saveAuthenticatedUser(publicUser)
    } catch {
      setServerError('Не удалось сохранить настройку')
    }
  }

  if (!user) {
    return (
      <section className={styles.page}>
        {isError ? (
          <ServerError
            message="Не удалось загрузить профиль."
            onRetry={() => void refetch()}
          />
        ) : (
          <p className={styles.loading}>Загружаем профиль...</p>
        )}
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <h1 id="profile-title" className={styles.pageTitle}>
        Мой профиль
      </h1>
      <Card className={styles.card}>
        <div className={styles.hero}>
          <div className={styles.identity}>
            <ProfileAvatar />
            <div className={styles.userInfo}>
              <p>{getProfileDisplayName(user)}</p>
              <p>{user.email}</p>
            </div>
          </div>

          <Link className={styles.editButton} to="/profile/edit">
            Редактировать
          </Link>
        </div>
      </Card>

      <div className={styles.preferences}>
        {serverError ? <ServerError message={serverError} /> : null}
        <div className={styles.preference}>
          <label className={styles.languageLabel}>
            Язык:
            <span className={styles.selectWrap}>
              <select
                value={language}
                aria-label="Язык"
                disabled={isSavingPreferences}
                onChange={(event) => {
                  const nextLanguage = event.target.value as LanguageCode
                  void savePreference({ language: nextLanguage })
                }}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <DropdownIcon />
            </span>
          </label>
        </div>

        <Switch
          appearance="radio"
          className={styles.notify}
          checked={notifyByEmail}
          disabled={isSavingPreferences}
          label="Уведомлять об изменении статуса заказов по email"
          onChange={(event) => {
            const nextValue = event.target.checked
            void savePreference({ notifyByEmail: nextValue })
          }}
        />

        <Link className={styles.logout} to="/profile/orders">
          История заказов
        </Link>
      </div>
    </section>
  )
}
