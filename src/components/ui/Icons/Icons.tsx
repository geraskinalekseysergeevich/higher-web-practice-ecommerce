import clsx from 'clsx'

import ArrowIconSvg from '../../../assets/Arrow.svg?react'
import DropdownIconSvg from '../../../assets/Dropdown.svg?react'
import SearchIconSvg from '../../../assets/Search.svg?react'
import ShoppingBagIconSvg from '../../../assets/Shopping_bag.svg?react'
import StarIconSvg from '../../../assets/Star.svg?react'
import UserIconSvg from '../../../assets/User.svg?react'
import styles from './Icons.module.css'

type IconProps = {
  className?: string
}

type ArrowIconProps = IconProps & {
  flipped?: boolean
}

export const SearchIcon = ({ className }: IconProps) => (
  <SearchIconSvg aria-hidden="true" focusable="false" className={className} />
)

export const UserIcon = ({ className }: IconProps) => (
  <UserIconSvg aria-hidden="true" focusable="false" className={className} />
)

export const CartIcon = ({ className }: IconProps) => (
  <ShoppingBagIconSvg
    aria-hidden="true"
    focusable="false"
    className={className}
  />
)

export const ArrowIcon = ({ className, flipped = false }: ArrowIconProps) => (
  <ArrowIconSvg
    aria-hidden="true"
    focusable="false"
    className={clsx(className, flipped && styles.flipped)}
  />
)

export const DropdownIcon = ({ className }: IconProps) => (
  <DropdownIconSvg aria-hidden="true" focusable="false" className={className} />
)

export const StarIcon = ({ className }: IconProps) => (
  <StarIconSvg aria-hidden="true" focusable="false" className={className} />
)

export const StarFilledIcon = ({ className }: IconProps) => (
  <StarIconSvg
    aria-hidden="true"
    focusable="false"
    className={clsx(className, styles.filled)}
  />
)
