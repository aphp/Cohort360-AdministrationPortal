import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/maintenanceService', () => ({
  listMaintenancePhases: vi.fn().mockResolvedValue({
    results: [
      {
        id: 1,
        subject: 'Patch',
        message: 'msg',
        type: 'partial',
        start_datetime: '2026-01-01T00:00:00Z',
        end_datetime: '2026-01-02T00:00:00Z',
        active: false
      }
    ],
    total: 1
  }),
  deleteMaintenancePhase: vi.fn()
}))
vi.mock('./MaintenanceDialog', () => ({
  default: () => <div data-testid="maintenance-dialog" />
}))

import MaintenanceTable from './index'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('MaintenanceTable', () => {
  it('renders the maintenance phases fetched from the service', async () => {
    renderWithProviders(<MaintenanceTable userRights={{ ...userDefaultRoles, right_full_admin: true }} />)
    await waitFor(() => expect(screen.getByText('Patch')).toBeInTheDocument())
  })

  it('shows the column headers', () => {
    renderWithProviders(<MaintenanceTable userRights={userDefaultRoles} />)
    expect(screen.getByText('Date de début')).toBeInTheDocument()
    expect(screen.getByText('Date de fin')).toBeInTheDocument()
  })
})
