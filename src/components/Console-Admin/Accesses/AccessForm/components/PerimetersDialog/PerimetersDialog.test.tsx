import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('components/Console-Admin/Perimeter/PerimeterTree', () => ({
  default: () => <div data-testid="perimeter-tree" />
}))

import PerimetersDialog from './PerimetersDialog'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

describe('PerimetersDialog', () => {
  it('renders the dialog with the perimeter tree', () => {
    renderWithProviders(
      <PerimetersDialog
        perimeter={null}
        onChangePerimeter={vi.fn()}
        open
        onClose={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByText(/Sélectionner un périmètre/i)).toBeInTheDocument()
    expect(screen.getByTestId('perimeter-tree')).toBeInTheDocument()
  })

  it('disables the validate button when no perimeter is selected', () => {
    renderWithProviders(
      <PerimetersDialog
        perimeter={null}
        onChangePerimeter={vi.fn()}
        open
        onClose={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByRole('button', { name: /Valider/i })).toBeDisabled()
  })

  it('enables the validate button when a perimeter is selected', () => {
    renderWithProviders(
      <PerimetersDialog
        perimeter={{ id: '1', name: 'X', type: 't', cohort_size: '0', children: [] } as never}
        onChangePerimeter={vi.fn()}
        open
        onClose={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByRole('button', { name: /Valider/i })).toBeEnabled()
  })
})
