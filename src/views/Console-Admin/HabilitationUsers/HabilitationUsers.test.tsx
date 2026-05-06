import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/rolesService', () => ({
  getRoleUser: vi.fn().mockResolvedValue('Admin role'),
  getUsersRole: vi.fn().mockResolvedValue({ accesses: [], total: 0 })
}))
vi.mock('components/HabilitationTable/HabilitationTable', () => ({
  default: () => <div data-testid="habilitation-table" />
}))

import HabilitationUsers from './HabilitationUsers'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('HabilitationUsers view', () => {
  it('renders the role title fetched from the service', async () => {
    renderWithProviders(<HabilitationUsers />, { route: '/habilitations/5/users', routePath: '/habilitations/:habilitationId/users' })
    await waitFor(() => expect(screen.getByText(/Admin role/i)).toBeInTheDocument())
    expect(screen.getByTestId('habilitation-table')).toBeInTheDocument()
  })
})
