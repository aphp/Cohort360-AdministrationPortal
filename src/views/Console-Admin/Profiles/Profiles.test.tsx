import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('services/Console-Admin/profilesService', () => ({
  getProfile: vi.fn().mockResolvedValue([])
}))
vi.mock('services/Console-Admin/usersService', () => ({
  getUser: vi.fn().mockResolvedValue({ username: 'jdoe', firstname: 'John', lastname: 'Doe' })
}))
vi.mock('services/Console-Admin/rolesService', () => ({
  getRoles: vi.fn().mockResolvedValue([])
}))
vi.mock('components/Console-Admin/Accesses/Profile', () => ({
  default: () => <div data-testid="profile-component" />
}))

import ProfilesView from './Profiles'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Profiles view', () => {
  it('loads user data and replaces the spinner once everything is fetched', async () => {
    renderWithProviders(<ProfilesView />, { route: '/users/jdoe/profiles', routePath: '/users/:user_id/profiles' })
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
