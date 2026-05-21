import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moment from 'moment'

vi.mock('services/Console-Admin/rolesService', () => ({
  getAssignableRoles: vi.fn().mockResolvedValue([])
}))
vi.mock('services/Console-Admin/profilesService', () => ({
  submitCreateAccess: vi.fn(),
  submitEditAccess: vi.fn()
}))
vi.mock('components/Console-Admin/Accesses/AccessForm/components/PerimetersDialog/PerimetersDialog', () => ({
  default: () => <div data-testid="perimeters-dialog" />
}))

import AccessForm from './AccessForm'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'
import { submitEditAccess } from 'services/Console-Admin/profilesService'

beforeEach(() => {
  vi.mocked(submitEditAccess).mockReset()
})

describe('AccessForm', () => {
  it('renders the dialog when open', () => {
    renderWithProviders(
      <AccessForm
        open
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        onFail={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(
      <AccessForm
        open={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        onFail={vi.fn()}
        userRights={userDefaultRoles}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('submits an existing access edition', async () => {
    const onClose = vi.fn()
    const onSuccess = vi.fn()
    vi.mocked(submitEditAccess).mockResolvedValueOnce(true as never)

    renderWithProviders(
      <AccessForm
        open
        onClose={onClose}
        onSuccess={onSuccess}
        onFail={vi.fn()}
        userRights={userDefaultRoles}
        access={
          {
            id: 7,
            role: { id: 3, name: 'Administrateur' },
            perimeter: { id: 42, name: 'AP-HP' },
            actual_start_datetime: moment().add(2, 'days').toISOString(),
            actual_end_datetime: moment().add(3, 'days').toISOString()
          } as never
        }
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /Valider/i }))

    await waitFor(() =>
      expect(submitEditAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          start_datetime: expect.any(String),
          end_datetime: expect.any(String)
        }),
        7
      )
    )
    expect(onSuccess).toHaveBeenCalledWith(true)
    expect(onClose).toHaveBeenCalled()
  })
})
