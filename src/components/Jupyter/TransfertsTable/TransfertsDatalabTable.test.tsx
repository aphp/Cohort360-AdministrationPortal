import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Jupyter/jupyterExportService', () => ({
  getDatalabExportsList: vi.fn().mockResolvedValue({
    list: [{ uuid: 'x', request_job_status: 'validated', created_at: '2026-01-01T00:00:00Z' }],
    total: 1
  }),
  getExportLogs: vi.fn(),
  retryExportRequest: vi.fn()
}))
vi.mock('components/Jupyter/TransfertForm/TransfertDatalabForm', () => ({
  default: () => <div data-testid="transfert-form" />
}))
vi.mock('components/Jupyter/TransfertsFilters/TransfertsFilters', () => ({
  default: () => <div data-testid="transferts-filters" />
}))

import TransfertsDatalabTable from './TransfertsDatalabTable'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('TransfertsDatalabTable', () => {
  it('renders the export list with a status chip matching the fetched data', async () => {
    renderWithProviders(<TransfertsDatalabTable userRights={userDefaultRoles} />)
    await waitFor(() => expect(screen.getByText('Confirmé')).toBeInTheDocument())
  })
})
