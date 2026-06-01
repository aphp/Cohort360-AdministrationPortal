import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

import HomePage from './HomePage'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

const meWith = (overrides: Partial<typeof userDefaultRoles>) => ({
  username: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'j@d.com',
  displayName: 'JD',
  userRights: { ...userDefaultRoles, ...overrides }
})

describe('HomePage', () => {
  it('renders the welcome heading', () => {
    renderWithProviders(<HomePage />, { preloadedState: { me: null } })
    expect(screen.getByText(/Bienvenue sur le portail/i)).toBeInTheDocument()
  })

  it('hides admin buttons when the user has no admin rights', () => {
    renderWithProviders(<HomePage />, { preloadedState: { me: meWith({}) } })
    expect(screen.queryByRole('button', { name: /Liste des utilisateurs/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Logs/i })).not.toBeInTheDocument()
  })

  it('shows admin-only buttons when the user is full admin', () => {
    renderWithProviders(<HomePage />, { preloadedState: { me: meWith({ right_full_admin: true }) } })
    expect(screen.getByRole('button', { name: /Liste des utilisateurs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Logs/i })).toBeInTheDocument()
  })

  it('navigates to the chosen page when its button is clicked', async () => {
    navigate.mockClear()
    renderWithProviders(<HomePage />, { preloadedState: { me: meWith({ right_full_admin: true }) } })
    await userEvent.click(screen.getByRole('button', { name: /Logs/i }))
    expect(navigate).toHaveBeenCalledWith('/console-admin/logs')
  })
})
