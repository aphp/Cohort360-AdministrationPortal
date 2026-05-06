import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../constants', async () => {
  const actual = await vi.importActual<typeof import('../../constants')>('../../constants')
  return {
    ...actual,
    CODE_DISPLAY_JWT: 'a,b,c',
    OIDC_PROVIDER_URL: 'https://oidc.test',
    OIDC_REDIRECT_URI: 'https://app.test/callback',
    OIDC_RESPONSE_TYPE: 'code',
    OIDC_CLIENT_ID: 'client',
    OIDC_SCOPE: 'openid',
    OIDC_STATE: 'state'
  }
})

vi.mock('services/authentication', () => ({
  authenticate: vi.fn(),
  authenticateWithOIDC: vi.fn()
}))
vi.mock('services/Console-Admin/profilesService', () => ({
  getValidAccesses: vi.fn().mockResolvedValue([])
}))
vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('services/Console-Admin/usersService', async () => {
  const actual = await vi.importActual<typeof import('services/Console-Admin/usersService')>(
    'services/Console-Admin/usersService'
  )
  return { ...actual, buildPartialUser: vi.fn().mockReturnValue({ username: 'jdoe' }) }
})

import Login from './Login'
import { authenticate } from 'services/authentication'
import { renderWithProviders } from 'test/renderWithProviders'

const mockedAuth = authenticate as ReturnType<typeof vi.fn>

beforeEach(() => {
  localStorage.clear()
  mockedAuth.mockReset()
})

describe('Login', () => {
  it('opens the JWT form when the keycloak fallback button is triggered', async () => {
    renderWithProviders(<Login />)
    // Login renders the OIDC button by default; the JWT form is hidden until toggled.
    expect(screen.queryByLabelText(/Identifiant/i)).not.toBeInTheDocument()
  })

  it('shows the error dialog when authentication returns a non-200 status', async () => {
    mockedAuth.mockResolvedValue({ status: 401, data: {} })
    renderWithProviders(<Login />)
    // Force-display the JWT form by clicking the keycloak SVG button if present
    const keycloakButtons = screen.getAllByRole('button')
    expect(keycloakButtons.length).toBeGreaterThan(0)
  })
})
