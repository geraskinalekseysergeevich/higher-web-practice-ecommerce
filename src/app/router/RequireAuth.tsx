import { Navigate, Outlet } from 'react-router-dom'

import { selectIsAuthenticated } from '../auth/authSlice'
import { useAppSelector } from '../hooks'

export const RequireAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}
