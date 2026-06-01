import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/usersService', () => ({
  getUsers: vi.fn().mockResolvedValue({ users: [], total: 0 })
}))
vi.mock('services/Console-Admin/cohortsService', () => ({
  getUserCohorts: vi.fn().mockResolvedValue([]),
  getUserFilters: vi.fn().mockResolvedValue([])
}))
vi.mock('services/Jupyter/jupyterExportService', () => ({
  datalabTransfer: vi.fn()
}))
vi.mock('services/Jupyter/datalabsService', () => ({
  getDatalabs: vi.fn().mockResolvedValue({ datalabs: [], total: 0 })
}))

import TransfertDatalabForm from './TransfertDatalabForm'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('TransfertDatalabForm', () => {
  it('renders the dialog with the default tables and form controls', async () => {
    renderWithProviders(
      <TransfertDatalabForm
        userRights={userDefaultRoles}
        onClose={vi.fn()}
        selectedTransferRequest={null}
        setSelectedTransferRequest={vi.fn()}
        onAddTransferRequestSuccess={vi.fn()}
        onAddTransferRequestFail={vi.fn()}
      />
    )
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
  })
})
