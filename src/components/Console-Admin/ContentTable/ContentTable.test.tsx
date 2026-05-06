import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('services/Console-Admin/contentsService', () => ({
  listContents: vi.fn().mockResolvedValue([
    { id: 1, title: 'Banner 1', content_type: 'banner', created_at: '2026-01-01T00:00:00Z' }
  ]),
  deleteContent: vi.fn()
}))
vi.mock('./ContentDialog', () => ({
  default: () => <div data-testid="content-dialog" />
}))

import ContentManagementTable from './index'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('ContentManagementTable', () => {
  it('renders the contents fetched from the service', async () => {
    renderWithProviders(
      <ContentManagementTable
        userRights={{ ...userDefaultRoles, right_full_admin: true }}
        contentTypes={{ Banner: 'banner' } as never}
        allowedContentTypes={['banner']}
        pages={['homepage']}
        labels={{ singular: 'banner', plural: 'banners' } as never}
      />
    )
    await waitFor(() => expect(screen.getByText('Banner 1')).toBeInTheDocument())
  })
})
