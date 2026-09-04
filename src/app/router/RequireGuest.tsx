import { Navigate, Outlet } from 'react-router-dom'

import { selectIsAuthenticated } from '../auth/authSlice'
import { useAppSelector } from '../hooks'

export const RequireGuest = () =>
  useAppSelector(selectIsAuthenticated) ? (
    <Navigate replace to="/" />
  ) : (
    <Outlet />
  )
