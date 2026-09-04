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
  subcategoriesByCategory: Record<string, string[]>
  styleOptions: string[]
  densityOptions: string[]
  selectedCategory?: string
  selectedSubcategory?: string
  selectedStyles: string[]
  selectedDensity?: string
  inStockOnly: boolean
  ratedOnly: boolean
  minPrice: string
  maxPrice: string
  hasActiveFilters: boolean
  onCategoryChange: (category?: string) => void
  onSubcategoryChange: (subcategory?: string) => void
  onStyleToggle: (style: string) => void
  onDensityChange: (density?: string) => void
  onInStockChange: (value: boolean) => void
  onRatedChange: (value: boolean) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onClearFilters: () => void
}

const switchLabels = ['В наличии', 'С рейтингом']

export const HomeSidebar = ({
  categories,
  subcategoriesByCategory,
  styleOptions,
  densityOptions,
  selectedCategory,
  selectedSubcategory,
  selectedStyles,
  selectedDensity,
  inStockOnly,
  ratedOnly,
  minPrice,
  maxPrice,
  hasActiveFilters,
  onCategoryChange,
  onSubcategoryChange,
  onStyleToggle,
  onDensityChange,
  onInStockChange,
  onRatedChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters,
}: HomeSidebarProps) => {
  const subcategories = selectedCategory
    ? (subcategoriesByCategory[selectedCategory] ?? [])
    : []

  return (
    <Card className={styles.root}>
      <div className={styles.group}>
        <h2 className={styles.groupTitle}>Категория</h2>

        {selectedCategory ? (
          <>
            <div className={styles.categoryTabs}>
              <ListButton
                label="Все категории"
                onClick={() => onCategoryChange(undefined)}
                selected={false}
              />
              <ListButton
                label={selectedCategory}
                onClick={() => onCategoryChange(selectedCategory)}
                selected
              />
            </div>

            <div className={styles.subcategories}>
              <ListButton
                label="Все подкатегории"
                onClick={() => onSubcategoryChange(undefined)}
                selected={!selectedSubcategory}
              />
              {subcategories.map((subcategory) => (
                <ListButton
                  key={subcategory}
                  label={subcategory}
                  onClick={() =>
                    onSubcategoryChange(
                      subcategory === selectedSubcategory
                        ? undefined
                        : subcategory
                    )
                  }
                  selected={subcategory === selectedSubcategory}
                />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.categories}>
            {categories.map((category) => (
              <ListButton
                key={category}
                label={category}
                onClick={() => onCategoryChange(category)}
                selected={category === selectedCategory}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.group}>
        <h2 className={styles.groupTitle}>Стиль</h2>
        <div className={styles.checklist}>
          {styleOptions.map((option) => (
            <Checkbox
              key={option}
              checked={selectedStyles.includes(option)}
              label={option}
              onChange={() => onStyleToggle(option)}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.groupTitle}>Густота</h2>
        <div className={styles.radios}>
          {densityOptions.map((option) => (
            <Radio
              key={option}
              checked={selectedDensity === option}
              label={option}
              name="density"
              onChange={() =>
                onDensityChange(selectedDensity === option ? undefined : option)
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.groupTitle}>Фильтр</h2>
        <div className={styles.switches}>
          <Switch
            checked={inStockOnly}
            label={switchLabels[0]}
            onChange={(event) => onInStockChange(event.target.checked)}
          />
          <Switch
            checked={ratedOnly}
            label={switchLabels[1]}
            onChange={(event) => onRatedChange(event.target.checked)}
          />
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.groupTitle}>Цена</h2>
        <div className={styles.priceRow}>
          <Input
            inputMode="numeric"
            min={0}
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="От"
            type="number"
            value={minPrice}
          />
          <Input
            inputMode="numeric"
            min={0}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="До"
            type="number"
            value={maxPrice}
          />
        </div>
      </div>

      <Button
        className={styles.clearButton}
        disabled={!hasActiveFilters}
        onClick={onClearFilters}
        type="button"
        variant="secondary"
      >
        Очистить фильтры
      </Button>
    </Card>
  )
}
