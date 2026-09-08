import clsx from 'clsx'

import ArrowIconSvg from '../../../assets/Arrow.svg?react'
import CameraIconSvg from '../../../assets/Camera.svg?react'
import DropdownIconSvg from '../../../assets/Dropdown.svg?react'
import FilterIconSvg from '../../../assets/Filter.svg?react'
import SearchIconSvg from '../../../assets/Search.svg?react'
import ShoppingBagIconSvg from '../../../assets/Shopping_bag.svg?react'
import StarIconSvg from '../../../assets/Star.svg?react'
import TrashIconSvg from '../../../assets/Trash.svg?react'
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

export const HomeIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
)

export const ListIcon = ({ className }: IconProps) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
)

export const CameraIcon = ({ className }: IconProps) => (
  <CameraIconSvg aria-hidden="true" focusable="false" className={className} />
)

export const CartIcon = ({ className }: IconProps) => (
  <ShoppingBagIconSvg
    aria-hidden="true"
    focusable="false"
    className={className}
  />
)

export const TrashIcon = ({ className }: IconProps) => (
  <TrashIconSvg aria-hidden="true" focusable="false" className={className} />
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

export const FilterIcon = ({ className }: IconProps) => (
  <FilterIconSvg aria-hidden="true" focusable="false" className={className} />
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
