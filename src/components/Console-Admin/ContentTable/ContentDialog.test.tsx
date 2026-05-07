import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/contentsService', () => ({
  createContent: vi.fn(),
  updateContent: vi.fn()
}))
vi.mock('@mdxeditor/editor', () => ({
  MDXEditor: () => <div data-testid="mdx-editor" />,
  listsPlugin: () => null,
  ListsToggle: () => null,
  Separator: () => null,
  headingsPlugin: () => null,
  BoldItalicUnderlineToggles: () => null,
  toolbarPlugin: () => null
}))

import ContentDialog from './ContentDialog'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

const callbacks = {
  onClose: vi.fn(),
  onAddContentSuccess: vi.fn(),
  onEditContentSuccess: vi.fn(),
  onAddContentFail: vi.fn(),
  onEditContentFail: vi.fn()
}

describe('ContentDialog', () => {
  it('renders when open', () => {
    renderWithProviders(
      <ContentDialog
        open
        userRights={userDefaultRoles}
        contentTypes={{ Banner: 'banner' } as never}
        allowedContentTypes={['banner']}
        withMarkdown={false}
        labels={{ singular: 'banner', plural: 'banners', creation: 'Créer banner', edition: 'Éditer banner' } as never}
        selectedContent={{ title: '', content_type: 'banner', content: '' } as never}
        {...callbacks}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderWithProviders(
      <ContentDialog
        open={false}
        userRights={userDefaultRoles}
        contentTypes={{} as never}
        allowedContentTypes={[]}
        withMarkdown={false}
        labels={{} as never}
        selectedContent={{} as never}
        {...callbacks}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
