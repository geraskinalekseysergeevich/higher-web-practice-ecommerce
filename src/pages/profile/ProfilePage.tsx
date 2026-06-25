import { skipToken } from '@reduxjs/toolkit/query'
import { Link } from 'react-router-dom'

import { useGetUserByIdQuery } from '../../app/api/usersApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import { Card, SectionHeading } from '../../components/ui'
import { getProfileDisplayName } from '../../entities/user/lib/profile'
import { ProfileAvatar } from './components/ProfileAvatar'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const userId = authenticatedUser?.id
  const { data: user } = useGetUserByIdQuery(userId ?? skipToken)

  if (!user) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем профиль...</p>
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <Card className={styles.card}>
        <div className={styles.hero}>
          <ProfileAvatar />

          <SectionHeading
            eyebrow="Мой профиль"
            title={getProfileDisplayName(user)}
            description={user.email}
          />

          <Link className={styles.editButton} to="/profile/edit">
            Редактировать профиль
          </Link>
        </div>

        <div className={styles.preference}>
          <span className={styles.preferenceLabel}>
            Уведомлять об изменении статуса заказов по почте
          </span>
          <span className={styles.preferenceValue}>
            {user.notifyByEmail ? 'Включено' : 'Выключено'}
          </span>
        </div>
      </Card>
    </section>
  )
}
