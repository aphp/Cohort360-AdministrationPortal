import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Console-Admin/users/UsersTable/UsersTable', () => ({
  default: () => <div data-testid="users-table" />
}))

import UsersView from './Users'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Users view', () => {
  it('renders the title and replaces the spinner with the table once rights load', async () => {
    renderWithProviders(<UsersView />)
    expect(screen.getByText('Liste des utilisateurs')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('users-table')).toBeInTheDocument()
  })
})
