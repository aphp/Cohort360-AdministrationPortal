import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/rolesService', () => ({
  getAssignableRoles: vi.fn().mockResolvedValue([])
}))
vi.mock('services/Console-Admin/profilesService', () => ({
  submitCreateAccess: vi.fn(),
  submitEditAccess: vi.fn()
}))
vi.mock('components/Console-Admin/Accesses/AccessForm/components/PerimetersDialog/PerimetersDialog', () => ({
  default: () => <div data-testid="perimeters-dialog" />
}))

import AccessForm from './AccessForm'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

describe('AccessForm', () => {
  it('renders the dialog when open', () => {
    renderWithProviders(
      <AccessForm
        open
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        onFail={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(
      <AccessForm
        open={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        onFail={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
