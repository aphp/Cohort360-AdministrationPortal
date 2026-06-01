import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import HabilitationTable from './HabilitationTable'
import { renderWithProviders } from 'test/renderWithProviders'

const baseProps = {
  usersInHabilitation: [],
  page: 1,
  setPage: vi.fn(),
  total: 0,
  order: { orderBy: 'lastname', orderDirection: 'asc' as const },
  setOrder: vi.fn(),
  loading: false
}

describe('HabilitationTable', () => {
  it('shows the spinner while loading', () => {
    renderWithProviders(<HabilitationTable {...baseProps} loading />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders a row per user', () => {
    renderWithProviders(
      <HabilitationTable
        {...baseProps}
        usersInHabilitation={[
          { username: 'jdoe', firstname: 'John', lastname: 'Doe', perimeter: 'P1' } as never,
          { username: 'asmith', firstname: 'Anne', lastname: 'Smith', perimeter: 'P2' } as never
        ]}
        total={2}
      />
    )
    expect(screen.getByText(/Doe/i)).toBeInTheDocument()
    expect(screen.getByText(/Smith/i)).toBeInTheDocument()
  })
})
