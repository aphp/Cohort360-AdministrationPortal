import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/maintenanceService', () => ({
  createMaintenancePhase: vi.fn(),
  updateMaintenancePhase: vi.fn()
}))

import MaintenanceDialog from './MaintenanceDialog'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'
import type { MaintenancePhaseCreation } from 'services/Console-Admin/maintenanceService'

const callbacks = {
  onClose: vi.fn(),
  onAddMaintenanceSuccess: vi.fn(),
  onEditMaintenanceSuccess: vi.fn(),
  onAddMaintenanceFail: vi.fn(),
  onEditMaintenanceFail: vi.fn()
}

const baseMaintenance = {
  subject: '',
  message: '',
  type: 'partial' as const,
  start_datetime: '',
  end_datetime: '',
  is_data_saved_message_hidden: false
} as MaintenancePhaseCreation

describe('MaintenanceDialog', () => {
  it('renders the dialog when open', () => {
    renderWithProviders(
      <MaintenanceDialog open userRights={userDefaultRoles} selectedMaintenance={baseMaintenance} {...callbacks} />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(
      <MaintenanceDialog
        open={false}
        userRights={userDefaultRoles}
        selectedMaintenance={baseMaintenance}
        {...callbacks}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
