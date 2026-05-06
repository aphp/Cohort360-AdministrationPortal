import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import me from 'state/me'
import users from 'state/users'
import autoLogout from 'state/autoLogout'

type Options = Omit<RenderOptions, 'queries'> & {
  route?: string
  preloadedState?: any
  routePath?: string
}

export function renderWithProviders(ui: ReactElement, options: Options = {}) {
  const { route = '/', preloadedState, routePath, ...renderOptions } = options
  const store = configureStore({
    reducer: { me, users, autoLogout },
    preloadedState
  })

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {routePath ? (
          <Routes>
            <Route path={routePath} element={children as ReactElement} />
          </Routes>
        ) : (
          children
        )}
      </MemoryRouter>
    </Provider>
  )

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
