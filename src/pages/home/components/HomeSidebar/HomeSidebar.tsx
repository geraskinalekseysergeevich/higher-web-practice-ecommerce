import {
  Button,
  Card,
  Checkbox,
  Input,
  ListButton,
  Radio,
  Switch,
} from '../../../../components/ui'
import styles from './HomeSidebar.module.css'

type HomeSidebarProps = {
  categories: string[]
  styleOptions: string[]
  densityOptions: string[]
}

const filterOptions = ['требует укладки воском', 'повышает харизму']

export const HomeSidebar = ({
  categories,
  styleOptions,
  densityOptions,
}: HomeSidebarProps) => (
  <Card className={styles.root}>
    <div className={styles.group}>
      <h2 className={styles.groupTitle}>Категория</h2>
      <div className={styles.categories}>
        {categories.map((category, index) => (
          <ListButton key={category} label={category} selected={index === 0} />
        ))}
      </div>
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupTitle}>Стиль</h2>
      <div className={styles.checklist}>
        {styleOptions.map((option) => (
          <Checkbox key={option} label={option} />
        ))}
      </div>
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupTitle}>Густота</h2>
      <div className={styles.radios}>
        {densityOptions.map((option) => (
          <Radio key={option} label={option} name="density" />
        ))}
      </div>
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupTitle}>Фильтр</h2>
      <div className={styles.switches}>
        {filterOptions.map((option) => (
          <Switch key={option} label={option} />
        ))}
      </div>
    </div>

    <div className={styles.group}>
      <h2 className={styles.groupTitle}>Цена</h2>
      <div className={styles.priceRow}>
        <div className={styles.priceField}>
          <Input defaultValue="10" inputMode="numeric" />
        </div>
        <div className={styles.priceField}>
          <Input defaultValue="1000" inputMode="numeric" />
        </div>
      </div>
    </div>

    <Button
      className={styles.clearButton}
      type="button"
      variant="secondary"
      disabled
    >
      Очистить фильтры
    </Button>
  </Card>
)
