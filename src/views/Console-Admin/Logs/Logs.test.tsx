import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('services/Console-Admin/logsService', () => ({
  getLogs: vi.fn().mockResolvedValue({ logs: [], total: 0 })
}))
vi.mock('components/Console-Admin/Logs/LogsTable/LogsTable', () => ({
  default: () => <div data-testid="logs-table" />
}))
vi.mock('components/Console-Admin/Logs/LogsFilters/LogsFilters', () => ({
  default: () => <div data-testid="logs-filters" />
}))

import Logs from './Logs'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Logs view', () => {
  it('renders the logs table after the initial fetch resolves', async () => {
    renderWithProviders(<Logs />)
    await waitFor(() => expect(screen.getByTestId('logs-table')).toBeInTheDocument())
  })
})
