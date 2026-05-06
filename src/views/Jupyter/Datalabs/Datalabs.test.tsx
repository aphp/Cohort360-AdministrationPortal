import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Jupyter/Datalabs/DatalabsTable/DatalabsTable', () => ({
  default: () => <div data-testid="datalabs-table" />
}))

import Datalabs from './Datalabs'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Datalabs view', () => {
  it('renders the title and the table after loading', async () => {
    renderWithProviders(<Datalabs />)
    expect(screen.getByText('Liste des datalabs')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('datalabs-table')).toBeInTheDocument()
  })
})
