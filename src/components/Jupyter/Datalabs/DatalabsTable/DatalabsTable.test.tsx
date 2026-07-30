import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Jupyter/datalabsService', () => ({
  getDatalabs: vi.fn().mockResolvedValue({
    datalabs: [
      {
        uuid: 'a',
        name: 'Lab1',
        created_at: '2026-01-01T00:00:00Z',
        infrastructure_provider: { uuid: 'p1', name: 'GCP' }
      }
    ],
    total: 1
  }),
  getInfrastructureProviders: vi.fn().mockResolvedValue([])
}))
vi.mock('components/Jupyter/DatalabsForm/DatalabsForm', () => ({
  default: () => <div data-testid="datalabs-form" />
}))

import DatalabsTable from './DatalabsTable'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('DatalabsTable', () => {
  it('renders the datalabs fetched from the service', async () => {
    renderWithProviders(<DatalabsTable userRights={userDefaultRoles} />)
    await waitFor(() => expect(screen.getByText('Lab1')).toBeInTheDocument())
  })
})
