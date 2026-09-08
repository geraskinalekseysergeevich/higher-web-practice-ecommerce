import type { ChangeEvent } from 'react'

import {
  ArrowIcon,
  Button,
  Checkbox,
  Input,
  Radio,
  Switch,
} from '../../../components/ui'
import styles from './MobileFilters.module.css'

export type MobileFilterMode = 'filters' | 'style'

type MobileFiltersProps = {
  densityOptions: string[]
  inStockOnly: boolean
  maxPrice: string
  minPrice: string
  mode: MobileFilterMode
  ratedOnly: boolean
  selectedDensity?: string
  selectedStyles: string[]
  styleOptions: string[]
  onApply: () => void
  onBack: () => void
  onDensityChange: (density?: string) => void
  onInStockChange: (value: boolean) => void
  onMaxPriceChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onOpenStyle: () => void
  onRatedChange: (value: boolean) => void
  onStyleToggle: (style: string) => void
}

export const MobileFilters = ({
  densityOptions,
  inStockOnly,
  maxPrice,
  minPrice,
  mode,
  ratedOnly,
  selectedDensity,
  selectedStyles,
  styleOptions,
  onApply,
  onBack,
  onDensityChange,
  onInStockChange,
  onMaxPriceChange,
  onMinPriceChange,
  onOpenStyle,
  onRatedChange,
  onStyleToggle,
}: MobileFiltersProps) => {
  if (mode === 'style') {
    return (
      <section className={styles.root} aria-labelledby="mobile-style-title">
        <button
          className={styles.titleRow}
          type="button"
          onClick={onBack}
          aria-label="Назад к фильтрам"
        >
          <ArrowIcon className={styles.backIcon} />
          <h1 id="mobile-style-title">Стиль</h1>
        </button>

        <div className={styles.styleList}>
          {styleOptions.map((style) => (
            <Checkbox
              key={style}
              checked={selectedStyles.includes(style)}
              label={style}
              onChange={() => onStyleToggle(style)}
            />
          ))}
        </div>

        <Button className={styles.apply} type="button" onClick={onApply}>
          Применить
        </Button>
      </section>
    )
  }

  const handlePriceChange =
    (callback: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      callback(event.currentTarget.value)
    }

  return (
    <section className={styles.root} aria-labelledby="mobile-filters-title">
      <button
        className={styles.titleRow}
        type="button"
        onClick={onBack}
        aria-label="Назад к каталогу"
      >
        <ArrowIcon className={styles.backIcon} />
        <h1 id="mobile-filters-title">Фильтры</h1>
      </button>

      <div className={styles.card}>
        <h2>Цена</h2>
        <div className={styles.priceRow}>
          <Input
            className={styles.input}
            label="От"
            inputMode="numeric"
            min={0}
            onChange={handlePriceChange(onMinPriceChange)}
            type="number"
            value={minPrice}
          />
          <Input
            className={styles.input}
            label="До"
            inputMode="numeric"
            min={0}
            onChange={handlePriceChange(onMaxPriceChange)}
            type="number"
            value={maxPrice}
          />
        </div>
      </div>

      <div className={styles.card}>
        <button
          className={styles.cardTitle}
          type="button"
          aria-label="Стиль"
          onClick={onOpenStyle}
        >
          <strong>Стиль</strong>
          <span>
            {selectedStyles.length > 0 ? selectedStyles.join(', ') : 'Все'}
            <span aria-hidden="true">›</span>
          </span>
        </button>
        {selectedStyles.length > 0 ? (
          <div className={styles.tags}>
            {selectedStyles.map((style) => (
              <span key={style} className={styles.tag}>
                {style}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.card}>
        <h2>Густота</h2>
        <div className={styles.choices}>
          {densityOptions.map((density) => (
            <Radio
              key={density}
              checked={selectedDensity === density}
              label={density}
              name="mobile-density"
              onChange={() => onDensityChange(density)}
            />
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2>Фильтр</h2>
        <div className={styles.switches}>
          <Switch
            checked={inStockOnly}
            label="В наличии"
            onChange={(event) => onInStockChange(event.target.checked)}
          />
          <Switch
            checked={ratedOnly}
            label="С рейтингом"
            onChange={(event) => onRatedChange(event.target.checked)}
          />
        </div>
      </div>

      <Button className={styles.apply} type="button" onClick={onApply}>
        Применить фильтры
      </Button>
    </section>
  )
}
