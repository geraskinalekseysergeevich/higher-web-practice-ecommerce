import { ArrowIcon } from '../../../components/ui'
import styles from './AuthBackButton.module.css'

type AuthBackButtonProps = {
  onClick: () => void
}

export const AuthBackButton = ({ onClick }: AuthBackButtonProps) => (
  <button
    className={styles.root}
    type="button"
    aria-label="Назад"
    onClick={onClick}
  >
    <ArrowIcon className={styles.icon} />
  </button>
)
