import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/profilesService', () => ({
  getAccesses: vi.fn().mockResolvedValue({ accesses: [], total: 0 })
}))
vi.mock('./AccessForm/AccessForm', () => ({
  default: () => <div data-testid="access-form" />
}))
vi.mock('./AccessesTable/AccessesTable', () => ({
  default: () => <div data-testid="accesses-table" />
}))

import ProfileComponent from './Profile'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('ProfileComponent', () => {
  it('renders the accesses table after the initial fetch', async () => {
    renderWithProviders(
      <ProfileComponent
        profile={{ id: 1, source: 'src', is_active: true } as never}
        userRights={userDefaultRoles}
        roles={[]}
      />
    )
    await waitFor(() => expect(screen.getByTestId('accesses-table')).toBeInTheDocument())
  })
})
