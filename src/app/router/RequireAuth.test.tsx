import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { authReducer, setAuthenticatedUser } from '../auth/authSlice'
import { RequireAuth } from './RequireAuth'

const renderWithStore = (
  path: string,
  store = configureStore({
    reducer: { auth: authReducer },
  })
) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<div>home</div>} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<div>profile</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  )

describe('RequireAuth', () => {
  it('redirects unauthenticated user to home', () => {
    renderWithStore('/profile')

    expect(screen.getByText('home')).toBeInTheDocument()
    expect(screen.queryByText('profile')).not.toBeInTheDocument()
  })

  it('renders protected content for authenticated user', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
    })

    store.dispatch(
      setAuthenticatedUser({
        id: 'user-1',
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        createdAt: '2026-03-01T10:00:00Z',
      })
    )

    renderWithStore('/profile', store)

    expect(screen.getByText('profile')).toBeInTheDocument()
  })
})
