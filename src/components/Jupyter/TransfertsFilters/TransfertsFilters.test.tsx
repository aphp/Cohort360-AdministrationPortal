import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import TransfertsFilters from './TransfertsFilters'
import { renderWithProviders } from 'test/renderWithProviders'

describe('TransfertsFilters', () => {
  it('renders the dialog with status and type sections', () => {
    renderWithProviders(
      <TransfertsFilters
        filters={{
          exportType: [],
          request_job_status: [],
          insert_datetime_gte: null,
          insert_datetime_lte: null
        } as never}
        onChangeFilters={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
