import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('services/Console-Admin/maintenanceService', () => ({
  createMaintenancePhase: vi.fn(),
  updateMaintenancePhase: vi.fn()
}))

import MaintenanceDialog from './MaintenanceDialog'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'
import type { MaintenancePhaseCreation } from 'services/Console-Admin/maintenanceService'
import { createMaintenancePhase } from 'services/Console-Admin/maintenanceService'

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

beforeEach(() => {
  Object.values(callbacks).forEach((fn) => fn.mockClear())
  vi.mocked(createMaintenancePhase).mockReset()
})

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

  it('submits a new maintenance phase', async () => {
    vi.mocked(createMaintenancePhase).mockResolvedValueOnce(true as never)

    renderWithProviders(
      <MaintenanceDialog open userRights={userDefaultRoles} selectedMaintenance={baseMaintenance} {...callbacks} />
    )

    await userEvent.type(screen.getByLabelText(/Sujet/i), 'Maintenance programmee')
    await userEvent.type(screen.getByRole('textbox', { name: /Message/i }), 'Intervention en cours')
    await userEvent.click(screen.getByRole('radio', { name: /Maintenance compl/i }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Masquer le message/i }))
    await userEvent.click(screen.getByRole('button', { name: /Cr/i }))

    await waitFor(() =>
      expect(createMaintenancePhase).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Maintenance programmee',
          message: 'Intervention en cours',
          type: 'full',
          is_data_saved_message_hidden: true
        })
      )
    )
    expect(callbacks.onAddMaintenanceSuccess).toHaveBeenCalledWith(true)
    expect(callbacks.onClose).toHaveBeenCalled()
  })
})
