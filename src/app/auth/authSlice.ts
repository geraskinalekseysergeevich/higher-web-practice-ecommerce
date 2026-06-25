import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { User } from '../../types'
import type { RootState } from '../store'

const AUTH_STORAGE_KEY = 'ecommerce.authUser'

const readStoredUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawUser = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as User
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const saveAuthenticatedUser = (user: User) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export const clearAuthenticatedUserStorage = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

type AuthState = {
  user: User | null
}

const initialState: AuthState = {
  user: readStoredUser(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearAuthenticatedUser: (state) => {
      state.user = null
    },
  },
})

export const { clearAuthenticatedUser, setAuthenticatedUser } = authSlice.actions

export const selectAuthenticatedUser = (state: RootState) => state.auth.user

export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null

export const authReducer = authSlice.reducer
