import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('services/Console-Admin/contentsService', () => ({
  listContentTypes: vi.fn().mockResolvedValue({ Banner: 'banner', Note: 'note' })
}))
vi.mock('components/Console-Admin/ContentTable', () => ({
  default: () => <div data-testid="content-table" />
}))

import ContentManagement from './index'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('ContentManagement view', () => {
  it('renders the title, both tabs, and the active tab content table after loading', async () => {
    renderWithProviders(<ContentManagement />)
    expect(screen.getByText('Gestion des contenus')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Actualités/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Messages/i })).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getByTestId('content-table')).toBeInTheDocument()
  })
})
