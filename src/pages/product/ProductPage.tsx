import clsx from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAddToCartMutation } from '../../app/api/cartApi'
import { useGetProductByIdQuery } from '../../app/api/productsApi'
import { useGetRatingsByProductIdQuery } from '../../app/api/ratingsApi'
import {
  Button,
  Card,
  CartIcon,
  DropdownIcon,
  EmptyState,
  StarFilledIcon,
  StarIcon,
} from '../../components/ui'
import { getProductCharacteristicEntries } from '../../entities/product/lib/getProductCharacteristicEntries'
import { getProductReviewItems } from '../../entities/product/lib/getProductReviewItems'
import styles from './ProductPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

const formatBreadcrumb = (
  productCategory?: string,
  productSubcategory?: string
) =>
  ['Товарная группа', productCategory, productSubcategory]
    .filter(Boolean)
    .join(' / ')

export const ProductPage = () => {
  const { productId } = useParams()
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const { data: product, isLoading } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  })
  const { data: ratings = [] } = useGetRatingsByProductIdQuery(
    product?.id ?? '',
    {
      skip: !product,
    }
  )
  const [activeImage, setActiveImage] = useState<string | null>(null)

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем товар...</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className={styles.page}>
        <EmptyState
          title="Товар не найден"
          description="Проверьте ссылку или вернитесь к списку товаров."
          actionLabel="На главную"
          onAction={() => window.location.assign('/')}
        />
      </section>
    )
  }

  const images = product.images
  const currentImage =
    (activeImage && images.includes(activeImage) ? activeImage : images[0]) ??
    ''
  const currentImageIndex = images.indexOf(currentImage)
  const hasImages = images.length > 0
  const breadcrumb = formatBreadcrumb(
    product.characteristics['категория'],
    product.characteristics['подкатегория']
  )
  const characteristics = getProductCharacteristicEntries(product)
  const reviewItems = getProductReviewItems(ratings)
  const handlePreviousImage = () => {
    if (!hasImages) {
      return
    }

    const previousIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1

    setActiveImage(images[previousIndex])
  }

  const handleNextImage = () => {
    if (!hasImages) {
      return
    }

    const nextIndex =
      currentImageIndex >= 0 && currentImageIndex < images.length - 1
        ? currentImageIndex + 1
        : 0

    setActiveImage(images[nextIndex])
  }

  const handleAddToCart = async () => {
    if (!product) {
      return
    }

    try {
      await addToCart({ productId: product.id }).unwrap()
    } catch {
      // Ignore the failed mock mutation for now.
    }
  }

  return (
    <section className={styles.page} aria-labelledby="product-title">
      <p className={styles.breadcrumb}>{breadcrumb}</p>

      <Card className={styles.productCard}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            <img
              className={styles.mainImage}
              src={currentImage}
              alt={product.name}
            />
          </div>

          <div className={styles.thumbnailsSection}>
            <button
              className={styles.thumbNav}
              type="button"
              aria-label="Предыдущее изображение"
              onClick={handlePreviousImage}
            >
              <DropdownIcon
                className={clsx(styles.thumbNavIcon, styles.thumbNavIconLeft)}
              />
            </button>

            <div className={styles.thumbnails} aria-label="Галерея товара">
              {images.slice(0, 4).map((image) => (
                <button
                  key={image}
                  className={clsx(
                    styles.thumbnail,
                    image === currentImage && styles.thumbnailActive
                  )}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`Показать изображение товара «${product.name}»`}
                >
                  <img className={styles.thumbnailImage} src={image} alt="" />
                </button>
              ))}
            </div>

            <button
              className={styles.thumbNav}
              type="button"
              aria-label="Следующее изображение"
              onClick={handleNextImage}
            >
              <DropdownIcon
                className={clsx(
                  styles.thumbNavIcon,
                  styles.thumbNavIconRight
                )}
              />
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h1 id="product-title" className={styles.title}>
              {product.name}
            </h1>

            <div className={styles.ratingSummary}>
              <div className={styles.ratingTopRow}>
                <StarFilledIcon className={styles.ratingStar} />
                <span className={styles.ratingValue}>
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className={styles.ratingCount}>
                {product.ratingCount} оценок
              </span>
            </div>
          </div>

          <p className={styles.price}>
            {priceFormatter.format(product.price)} ₽
          </p>

          <div className={styles.actionRow}>
            <Button
              className={styles.addToCartButton}
              type="button"
              size="md"
              iconOnly
              disabled={!product.inStock || isAddingToCart}
              aria-label="Добавить товар в корзину"
              onClick={handleAddToCart}
            >
              <CartIcon className={styles.cartIcon} />
            </Button>

            <p className={styles.availability}>
              {product.inStock ? 'Есть в наличии' : 'Нет в наличии'}
            </p>
          </div>

          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>Описание</h2>
            <p className={styles.descriptionText}>{product.description}</p>
          </section>

          <section className={styles.block}>
            <h2 className={styles.sectionTitle}>О товаре</h2>

            <dl className={styles.definitionList}>
              {characteristics.map((item) => (
                <div key={item.label} className={styles.definitionRow}>
                  <dt className={styles.definitionTerm}>{item.label}</dt>
                  <dd className={styles.definitionValue}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </Card>

      <Card className={styles.reviewsCard}>
        <h2 className={styles.reviewsTitle}>Оцените усы</h2>

        <div className={styles.reviewInput} aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              className={styles.reviewStarButton}
              type="button"
              disabled
            >
              <StarIcon className={styles.reviewStar} />
            </button>
          ))}
        </div>

        <div className={styles.reviewsList}>
          {reviewItems.length > 0 ? (
            reviewItems.map((review) => (
              <article key={review.id} className={styles.reviewRow}>
                <div className={styles.reviewStars}>
                  {review.stars.map((filled, index) => (
                    filled ? (
                      <StarFilledIcon
                        key={`${review.id}-star-${index}`}
                        className={styles.reviewStarFilled}
                      />
                    ) : (
                      <StarIcon
                        key={`${review.id}-star-${index}`}
                        className={styles.reviewStarMuted}
                      />
                    )
                  ))}
                </div>

                <span className={styles.reviewScore}>{review.ratingLabel}</span>
                <span className={styles.reviewAuthor}>{review.userName}</span>
                <time className={styles.reviewDate}>{review.dateLabel}</time>
              </article>
            ))
          ) : (
            <p className={styles.reviewsEmpty}>Пока нет отзывов.</p>
          )}
        </div>
      </Card>
    </section>
  )
}
