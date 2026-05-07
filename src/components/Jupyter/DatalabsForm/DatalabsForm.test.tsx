import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Jupyter/datalabsService', () => ({
  addNewDatalab: vi.fn()
}))

import DatalabsForm from './DatalabsForm'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

describe('DatalabsForm', () => {
  it('renders the form fields for a new datalab', () => {
    renderWithProviders(
      <DatalabsForm
        userRights={userDefaultRoles}
        selectedDatalab={{ name: '', infrastructure_provider: { uuid: '', name: '' } } as never}
        infrastructureProviders={[{ uuid: '1', name: 'GCP' }] as never}
        onClose={vi.fn()}
        onAddDatalabSuccess={vi.fn()}
        onAddDatalabFail={vi.fn()}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
