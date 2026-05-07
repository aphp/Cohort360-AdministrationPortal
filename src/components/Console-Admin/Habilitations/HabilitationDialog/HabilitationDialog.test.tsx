import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] })
  }
}))
vi.mock('services/Console-Admin/rolesService', () => ({
  createRoles: vi.fn(),
  submitEditRoles: vi.fn()
}))

import HabilitationDialog from './HabilitationDialog'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

const callbacks = {
  onClose: vi.fn(),
  onAddRoleSuccess: vi.fn(),
  onEditRoleSuccess: vi.fn(),
  onAddRoleFail: vi.fn(),
  onEditRoleFail: vi.fn()
}

describe('HabilitationDialog', () => {
  it('renders the dialog when open', async () => {
    renderWithProviders(
      <HabilitationDialog
        open
        userRights={userDefaultRoles}
        selectedRole={{ name: '', ...userDefaultRoles }}
        {...callbacks}
      />
    )
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
  })

  it('does not render when closed', () => {
    renderWithProviders(
      <HabilitationDialog
        open={false}
        userRights={userDefaultRoles}
        selectedRole={{ name: '', ...userDefaultRoles }}
        {...callbacks}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
