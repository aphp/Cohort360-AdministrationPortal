import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('components/Console-Admin/Perimeter/PerimeterTree', () => ({
  default: () => <div data-testid="perimeter-tree" />
}))

import Perimeters from './Perimeters'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('Perimeters view', () => {
  it('renders the title and the perimeter tree after loading', async () => {
    renderWithProviders(<Perimeters />)
    expect(screen.getByText('Liste des périmètres')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('perimeter-tree')).toBeInTheDocument()
  })
})
