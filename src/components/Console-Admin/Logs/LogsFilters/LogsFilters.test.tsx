import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('../../Accesses/AccessForm/components/PerimetersDialog/PerimetersDialog', () => ({
  default: () => <div data-testid="perimeters-dialog" />
}))

import LogsFilters from './LogsFilters'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

describe('LogsFilters', () => {
  it('renders the dialog with filter inputs', () => {
    renderWithProviders(
      <LogsFilters
        filters={{
          url: null,
          user: null,
          httpMethod: [],
          statusCode: [],
          afterDate: null,
          beforeDate: null,
          access: null,
          perimeter: { perimeterId: null, perimeterName: null }
        } as never}
        onChangeFilters={vi.fn()}
        onClose={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
