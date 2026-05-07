import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/usersService', () => ({
  checkUser: vi.fn().mockResolvedValue({ found: false }),
  editUser: vi.fn().mockResolvedValue(true),
  submitCreateUser: vi.fn().mockResolvedValue(true)
}))

import UserForm from './UserForm'
import { renderWithProviders } from 'test/renderWithProviders'

const callbacks = {
  onClose: vi.fn(),
  onAddUserSuccess: vi.fn(),
  onEditUserSuccess: vi.fn(),
  onAddUserFail: vi.fn(),
  onEditUserFail: vi.fn()
}

beforeEach(() => Object.values(callbacks).forEach((fn) => fn.mockClear()))

describe('UserForm', () => {
  it('renders an empty creation form when no user is selected', () => {
    renderWithProviders(<UserForm open selectedUser={{ username: '' }} {...callbacks} />)
    expect(screen.getByText(/Créer un nouvel utilisateur/i)).toBeInTheDocument()
  })

  it('does not render the dialog content when closed', () => {
    renderWithProviders(<UserForm open={false} selectedUser={{ username: '' }} {...callbacks} />)
    expect(screen.queryByText(/Créer un nouvel utilisateur/i)).not.toBeInTheDocument()
  })
})
