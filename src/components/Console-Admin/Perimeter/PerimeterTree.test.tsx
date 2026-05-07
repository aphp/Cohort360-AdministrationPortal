import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/perimetersService', () => ({
  getScopePerimeters: vi.fn().mockResolvedValue([]),
  getPerimetersChildren: vi.fn().mockResolvedValue([]),
  searchInPerimeters: vi.fn().mockResolvedValue([]),
  getManageablePerimeters: vi.fn().mockResolvedValue([]),
  getPerimeters: vi.fn().mockResolvedValue([])
}))

import PerimeterTree from './PerimeterTree'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('PerimeterTree', () => {
  it('renders the table once initial data resolves', async () => {
    renderWithProviders(
      <PerimeterTree defaultSelectedItems={null} onChangeSelectedItem={vi.fn()} userRights={userDefaultRoles} />
    )
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
  })
})
