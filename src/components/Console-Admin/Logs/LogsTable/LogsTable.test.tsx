import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LogsTable from './LogsTable'

describe('LogsTable', () => {
  it('shows the spinner while loading', () => {
    render(<LogsTable loading logs={[]} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders an empty state when there are no logs', () => {
    render(<LogsTable loading={false} logs={[]} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('renders one entry per log', () => {
    render(
      <LogsTable
        loading={false}
        logs={[
          { id: '1', requested_at: '2026-01-01T00:00:00Z', method: 'GET', path: '/foo', status_code: 200 } as never,
          { id: '2', requested_at: '2026-02-01T00:00:00Z', method: 'POST', path: '/bar', status_code: 201 } as never
        ]}
      />
    )
    expect(screen.getByText(/01\/01\/2026/)).toBeInTheDocument()
    expect(screen.getByText(/01\/02\/2026/)).toBeInTheDocument()
  })
})
