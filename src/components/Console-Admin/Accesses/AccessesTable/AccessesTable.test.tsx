import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/profilesService', () => ({
  onDeleteOrTerminateAccess: vi.fn()
}))
vi.mock('../AccessForm/AccessForm', () => ({
  default: () => <div data-testid="access-form" />
}))

import AccessesTable from './AccessesTable'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

const baseProps = {
  loading: false,
  page: 1,
  setPage: vi.fn(),
  total: 0,
  accesses: undefined,
  getAccesses: vi.fn(),
  order: { orderBy: 'is_valid', orderDirection: 'asc' as const },
  setOrder: vi.fn(),
  userRights: userDefaultRoles,
  roles: []
}

describe('AccessesTable', () => {
  it('shows the spinner while loading', () => {
    renderWithProviders(<AccessesTable {...baseProps} loading />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders rows when accesses are provided', () => {
    renderWithProviders(
      <AccessesTable
        {...baseProps}
        accesses={[
          {
            id: 1,
            is_valid: true,
            role: { name: 'admin' },
            actual_start_datetime: '2026-01-01T00:00:00Z',
            actual_end_datetime: '2026-12-31T00:00:00Z'
          } as never
        ]}
        total={1}
      />
    )
    expect(screen.getByText(/admin/i)).toBeInTheDocument()
  })
})
