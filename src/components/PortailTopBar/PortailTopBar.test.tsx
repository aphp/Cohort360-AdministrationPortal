import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})
vi.mock('services/authentication', () => ({
  logout: vi.fn().mockResolvedValue(undefined)
}))

import PortailTopBar from './PortailTopBar'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

const me = (overrides: Partial<typeof userDefaultRoles> = {}) => ({
  username: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'j@d.com',
  displayName: 'JD',
  userRights: { ...userDefaultRoles, ...overrides }
})

beforeEach(() => navigate.mockClear())

describe('PortailTopBar', () => {
  it('renders the user initials from the me state', () => {
    renderWithProviders(<PortailTopBar />, { preloadedState: { me: me() } })
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('opens the Console-Admin menu and lists admin-only items when the user is full admin', async () => {
    renderWithProviders(<PortailTopBar />, { preloadedState: { me: me({ right_full_admin: true }) } })
    await userEvent.click(screen.getByRole('button', { name: /Console admin/i }))
    expect(screen.getByRole('menuitem', { name: /Logs/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Maintenance/i })).toBeInTheDocument()
  })
})
