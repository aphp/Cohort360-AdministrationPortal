import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrivateRoute from './PrivateRoute'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'
import { ACCESS_TOKEN } from '../../constants'

const me = {
  username: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'j@d.com',
  displayName: 'JD',
  userRights: userDefaultRoles
}

beforeEach(() => localStorage.clear())

describe('PrivateRoute', () => {
  it('shows the disconnected dialog when there is no me state', () => {
    renderWithProviders(<PrivateRoute />, { preloadedState: { me: null } })
    expect(screen.getByText(/plus connecté/i)).toBeInTheDocument()
  })

  it('records the current path in localStorage when the user clicks Ok in the dialog', async () => {
    renderWithProviders(<PrivateRoute />, { preloadedState: { me: null }, route: '/console-admin/users' })
    await userEvent.click(screen.getByRole('button', { name: /Ok/i }))
    expect(localStorage.getItem('old-path')).toBe('/console-admin/users')
  })

  it('renders the outlet when me is set', () => {
    localStorage.setItem(ACCESS_TOKEN, 'token')
    renderWithProviders(<PrivateRoute />, { preloadedState: { me } })
    expect(screen.queryByText(/plus connecté/i)).not.toBeInTheDocument()
  })
})
