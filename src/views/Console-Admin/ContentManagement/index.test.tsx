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
  it('renders the content table after loading rights', async () => {
    renderWithProviders(<ContentManagement />)
    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))
    expect(screen.getAllByTestId('content-table').length).toBeGreaterThan(0)
  })
})
