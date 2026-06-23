import { SelectButton } from '../../../../components/ui'
import styles from './HomeTopBar.module.css'

export const HomeTopBar = () => (
  <div className={styles.root}>
    <h1 id="home-title" className={styles.title}>
      УСЫ
    </h1>

    <div className={styles.toolbar} aria-label="Сортировка и отображение">
      <SelectButton label="Сортировка" />
      <SelectButton label="Отображение" />
    </div>
  </div>
)
