import { skipToken } from '@reduxjs/toolkit/query'
import clsx from 'clsx'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from '../../app/api/cartApi'
import { useGetOrdersByUserIdQuery } from '../../app/api/ordersApi'
import { useGetProductByIdQuery } from '../../app/api/productsApi'
import {
  useCreateRatingMutation,
  useGetRatingsByProductIdQuery,
  useUpdateRatingMutation,
} from '../../app/api/ratingsApi'
import { selectAuthenticatedUser } from '../../app/auth/authSlice'
import { useAppSelector } from '../../app/hooks'
import {
  Button,
  Card,
  CartIcon,
  DropdownIcon,
  EmptyState,
  ServerError,
  StarFilledIcon,
  StarIcon,
} from '../../components/ui'
import { getProductCharacteristicEntries } from '../../entities/product/lib/getProductCharacteristicEntries'
import {
  canUserRateProduct,
  getProductRatingSummary,
  getUserProductRating,
} from '../../entities/product/lib/getProductRatingSummary'
import { getProductReviewItems } from '../../entities/product/lib/getProductReviewItems'
import { getProfileDisplayName } from '../../entities/user/lib/profile'
import { formatBreadcrumb } from './lib/formatBreadcrumb'
import styles from './ProductPage.module.css'

const priceFormatter = new Intl.NumberFormat('ru-RU')

export const ProductPage = () => {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const [updateCartItem, { isLoading: isUpdatingCart }] =
    useUpdateCartItemMutation()
  const [removeFromCart, { isLoading: isRemovingCart }] =
    useRemoveFromCartMutation()
  const [createRating, { isLoading: isCreatingRating }] =
    useCreateRatingMutation()
  const [updateRating, { isLoading: isUpdatingRating }] =
    useUpdateRatingMutation()
  const {
    data: cartItems = [],
    isError: isCartError,
    refetch: refetchCart,
  } = useGetCartQuery(authenticatedUser?.id ?? skipToken)
  const {
    data: product,
    isError: isProductError,
    isLoading,
    refetch: refetchProduct,
  } = useGetProductByIdQuery(productId ?? '', {
    skip: !productId,
  })
  const {
    data: ratings = [],
    isError: isRatingsError,
    refetch: refetchRatings,
  } = useGetRatingsByProductIdQuery(product?.id ?? '', {
    skip: !product,
  })
  const {
    data: orders = [],
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useGetOrdersByUserIdQuery(authenticatedUser?.id ?? skipToken)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [ratingError, setRatingError] = useState('')
  const [cartError, setCartError] = useState('')

  if (isLoading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Загружаем товар...</p>
      </section>
    )
  }

  if (isProductError) {
    return (
      <section className={styles.page}>
        <ServerError
          message="Не удалось загрузить товар."
          onRetry={() => void refetchProduct()}
        />
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
    '/product-placeholder.svg'
  const currentImageIndex = images.indexOf(currentImage)
  const hasImages = images.length > 0
  const breadcrumb = formatBreadcrumb(
    product.characteristics['категория'],
    product.characteristics['подкатегория']
  )
  const characteristics = getProductCharacteristicEntries(product)
  const reviewItems = getProductReviewItems(ratings)
  const ratingSummary = getProductRatingSummary(ratings)
  const cartItem = cartItems.find((item) => item.productId === product.id)
  const isCartMutationPending =
    isAddingToCart || isUpdatingCart || isRemovingCart
  const canRate = Boolean(
    authenticatedUser &&
    canUserRateProduct(orders, authenticatedUser.id, product.id)
  )
  const existingRating = authenticatedUser
    ? getUserProductRating(ratings, authenticatedUser.id, product.id)
    : undefined
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

    if (!authenticatedUser) {
      navigate('/login', {
        state: {
          from: { pathname: location.pathname, search: location.search },
        },
      })
      return
    }

    setCartError('')
    try {
      if (cartItem) {
        await updateCartItem({
          id: cartItem.id,
          quantity: cartItem.quantity + 1,
        }).unwrap()
      } else {
        await addToCart({
          productId: product.id,
          userId: authenticatedUser.id,
        }).unwrap()
      }
    } catch {
      setCartError('Не удалось обновить корзину')
    }
  }

  const handleDecreaseCartQuantity = async () => {
    if (!cartItem) {
      return
    }

    setCartError('')

    try {
      if (cartItem.quantity <= 1) {
        await removeFromCart(cartItem.id).unwrap()
        return
      }

      await updateCartItem({
        id: cartItem.id,
        quantity: cartItem.quantity - 1,
      }).unwrap()
    } catch {
      setCartError('Не удалось обновить корзину')
    }
  }

  const handleCreateRating = async () => {
    if (!authenticatedUser || !canRate || selectedRating === null) {
      return
    }

    setRatingError('')

    try {
      if (existingRating?.id) {
        await updateRating({
          id: existingRating.id,
          rating: selectedRating,
        }).unwrap()
      } else {
        await createRating({
          productId: product.id,
          userId: authenticatedUser.id,
          userName: getProfileDisplayName(authenticatedUser),
          rating: selectedRating,
        }).unwrap()
      }
      setSelectedRating(null)
    } catch {
      setRatingError('Не удалось сохранить оценку')
    }
  }

  return (
    <section className={styles.page} aria-labelledby="product-title">
      <p className={styles.breadcrumb}>{breadcrumb}</p>

      <Card className={styles.productCard}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            {hasImages ? (
              <button
                className={clsx(styles.thumbNav, styles.mobileThumbNav)}
                type="button"
                aria-label="Предыдущее изображение"
                onClick={handlePreviousImage}
              >
                <DropdownIcon
                  className={clsx(styles.thumbNavIcon, styles.thumbNavIconLeft)}
                />
              </button>
            ) : null}

            <img
              className={styles.mainImage}
              src={currentImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src = '/product-placeholder.svg'
              }}
            />

            {hasImages ? (
              <button
                className={clsx(styles.thumbNav, styles.mobileThumbNav)}
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
            ) : null}
          </div>

          {hasImages ? (
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
                    <img
                      className={styles.thumbnailImage}
                      src={image}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.src = '/product-placeholder.svg'
                      }}
                    />
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
          ) : null}
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <h1 id="product-title" className={styles.title}>
                {product.name}
              </h1>

              <p className={styles.price}>
                {priceFormatter.format(product.price)} ₽
              </p>
            </div>

            <div className={styles.ratingSummary}>
              <div className={styles.ratingTopRow}>
                <StarFilledIcon className={styles.ratingStar} />
                <span className={styles.ratingValue}>
                  {(ratingSummary.ratingCount > 0
                    ? ratingSummary.rating
                    : product.rating
                  ).toFixed(1)}
                </span>
              </div>
              <span className={styles.ratingCount}>
                {ratingSummary.ratingCount > 0
                  ? ratingSummary.ratingCount
                  : product.ratingCount}{' '}
                оценок
              </span>
            </div>
          </div>

          <div className={styles.actionRow}>
            {cartItem ? (
              <div
                className={styles.quantity}
                role="group"
                aria-label={`Количество товара ${product.name}`}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  aria-label={`Уменьшить количество ${product.name}`}
                  disabled={isCartMutationPending}
                  onClick={() => void handleDecreaseCartQuantity()}
                >
                  −
                </Button>
                <span className={styles.quantityValue}>
                  {cartItem.quantity}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  aria-label={`Увеличить количество ${product.name}`}
                  disabled={!product.inStock || isCartMutationPending}
                  onClick={() => void handleAddToCart()}
                >
                  +
                </Button>
              </div>
            ) : (
              <Button
                className={styles.addToCartButton}
                type="button"
                size="md"
                disabled={!product.inStock || isCartMutationPending}
                aria-label={`Добавить «${product.name}» в корзину`}
                onClick={() => void handleAddToCart()}
              >
                <CartIcon className={styles.cartIcon} />
                <span className={styles.addLabel}>Добавить в корзину</span>
              </Button>
            )}

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

        {authenticatedUser && canRate ? (
          <div className={styles.reviewComposer}>
            <div className={styles.reviewInput} aria-label="Ваша оценка">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  className={styles.reviewStarButton}
                  type="button"
                  aria-label={`Оценка ${index + 1}`}
                  aria-pressed={selectedRating === index + 1}
                  onClick={() => setSelectedRating(index + 1)}
                >
                  {selectedRating !== null && selectedRating > index ? (
                    <StarFilledIcon className={styles.reviewStar} />
                  ) : (
                    <StarIcon className={styles.reviewStar} />
                  )}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              type="button"
              disabled={
                selectedRating === null || isCreatingRating || isUpdatingRating
              }
              onClick={() => void handleCreateRating()}
            >
              {existingRating ? 'Обновить оценку' : 'Сохранить оценку'}
            </Button>
          </div>
        ) : (
          <p className={styles.reviewHint}>
            {authenticatedUser
              ? 'Оценка доступна после получения заказа.'
              : 'Войдите, чтобы оценить товар после покупки.'}
          </p>
        )}

        {ratingError ? (
          <p className={styles.ratingError}>{ratingError}</p>
        ) : null}
        {cartError ? <p className={styles.ratingError}>{cartError}</p> : null}
        {isCartError ? (
          <ServerError
            message="Не удалось загрузить корзину."
            onRetry={() => void refetchCart()}
          />
        ) : null}
        {isRatingsError || isOrdersError ? (
          <ServerError
            message="Не удалось загрузить все оценки товара."
            onRetry={() => {
              if (isRatingsError) void refetchRatings()
              if (isOrdersError) void refetchOrders()
            }}
          />
        ) : null}

        <div className={styles.reviewsList}>
          {reviewItems.length > 0 ? (
            reviewItems.map((review) => (
              <article key={review.id} className={styles.reviewRow}>
                <div className={styles.reviewStars}>
                  {review.stars.map((filled, index) =>
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
                  )}
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
