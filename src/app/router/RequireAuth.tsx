import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { selectIsAuthenticated } from '../auth/authSlice'
import { useAppSelector } from '../hooks'

export const RequireAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />
  }

  return <Outlet />
}
