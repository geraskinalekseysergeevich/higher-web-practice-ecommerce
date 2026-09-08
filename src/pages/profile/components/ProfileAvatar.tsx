import { CameraIcon, UserIcon } from '../../../components/ui'
import styles from './ProfileAvatar.module.css'

type ProfileAvatarProps = {
  editing?: boolean
}

export const ProfileAvatar = ({ editing = false }: ProfileAvatarProps) => {
  return (
    <div className={styles.root} aria-hidden="true">
      <span className={styles.avatar}>
        <UserIcon className={styles.icon} />
      </span>
      {editing ? (
        <span className={styles.camera}>
          <CameraIcon className={styles.cameraIcon} />
        </span>
      ) : null}
    </div>
  )
}
