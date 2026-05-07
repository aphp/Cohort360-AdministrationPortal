import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Jupyter/TransfertsTable/TransfertsDatalabTable', () => ({
  default: () => <div data-testid="transferts-table" />
}))

import TransfertDatalab from './TransfertDatalab'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('TransfertDatalab view', () => {
  it('renders the transferts table after loading rights', async () => {
    renderWithProviders(<TransfertDatalab />)
    expect(screen.getByText('Liste des demandes de transfert')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('transferts-table')).toBeInTheDocument()
  })
})
