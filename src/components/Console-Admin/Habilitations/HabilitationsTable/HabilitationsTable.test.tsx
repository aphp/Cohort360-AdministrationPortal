import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/rolesService', () => ({
  getRoles: vi.fn().mockResolvedValue([{ id: 1, name: 'Admin' }, { id: 2, name: 'Reader' }]),
  deleteRole: vi.fn()
}))
vi.mock('../HabilitationDialog/HabilitationDialog', () => ({
  default: () => <div data-testid="habilitation-dialog" />
}))

import HabilitationsTable from './HabilitationsTable'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('HabilitationsTable', () => {
  it('lists roles fetched from the service', async () => {
    renderWithProviders(<HabilitationsTable userRights={userDefaultRoles} />)
    await waitFor(() => expect(screen.getByText('Admin')).toBeInTheDocument())
    expect(screen.getByText('Reader')).toBeInTheDocument()
  })
})
