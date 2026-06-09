import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Console-Admin/Habilitations/HabilitationsTable/HabilitationsTable', () => ({
  default: () => <div data-testid="habilitations-table" />
}))

import Habilitations from './Habilitations'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Habilitations view', () => {
  it('renders the title and the table after loading', async () => {
    renderWithProviders(<Habilitations />)
    expect(screen.getByText('Liste des habilitations')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('habilitations-table')).toBeInTheDocument()
  })
})
