import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Console-Admin/MaintenanceTable', () => ({
  default: () => <div data-testid="maintenance-table" />
}))

import MaintenanceManagement from './index'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Maintenance view', () => {
  it('renders the title and the table after loading', async () => {
    renderWithProviders(<MaintenanceManagement />)
    expect(screen.getByText('Gestion des maintenances')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('maintenance-table')).toBeInTheDocument()
  })
})
