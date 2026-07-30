import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'

const columns = [
  { code: 'name', label: 'Name', sortableColumn: true, align: 'left' as const },
  { code: 'foo', label: 'Foo', sortableColumn: false, align: 'left' as const }
]

describe('DataTable', () => {
  it('renders the column headers and the children rows', () => {
    render(
      <DataTable columns={columns} order={{ orderBy: 'name', orderDirection: 'asc' }}>
        <tr>
          <td>row-content</td>
        </tr>
      </DataTable>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Foo')).toBeInTheDocument()
    expect(screen.getByText('row-content')).toBeInTheDocument()
  })

  it('toggles sort direction when the same sortable header is clicked', async () => {
    const setOrder = vi.fn()
    render(
      <DataTable columns={columns} order={{ orderBy: 'name', orderDirection: 'asc' }} setOrder={setOrder}>
        <tr />
      </DataTable>
    )
    await userEvent.click(screen.getByText('Name'))
    expect(setOrder).toHaveBeenCalledWith({ orderBy: 'name', orderDirection: 'desc' })
  })

  it('sorts ascending when a different sortable column is clicked', async () => {
    const setOrder = vi.fn()
    render(
      <DataTable columns={columns} order={{ orderBy: 'foo', orderDirection: 'desc' }} setOrder={setOrder}>
        <tr />
      </DataTable>
    )
    await userEvent.click(screen.getByText('Name'))
    expect(setOrder).toHaveBeenCalledWith({ orderBy: 'name', orderDirection: 'asc' })
  })

  it('shows pagination when page is provided and forwards the change', async () => {
    const setPage = vi.fn()
    render(
      <DataTable
        columns={columns}
        order={{ orderBy: 'name', orderDirection: 'asc' }}
        page={1}
        setPage={setPage}
        rowsPerPage={10}
        total={30}
      >
        <tr />
      </DataTable>
    )
    await userEvent.click(screen.getByRole('button', { name: /Go to page 2/i }))
    expect(setPage).toHaveBeenCalledWith(2)
  })
})
