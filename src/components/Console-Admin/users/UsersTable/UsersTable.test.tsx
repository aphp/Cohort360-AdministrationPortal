import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'

vi.mock('services/Console-Admin/usersService', () => ({
  getUsers: vi.fn().mockResolvedValue({ users: [], total: 0 })
}))
vi.mock('../UserForm/UserForm', () => ({
  default: () => <div data-testid="user-form" />
}))

import UsersTable from './UsersTable'
import { renderWithProviders } from 'test/renderWithProviders'
import { userDefaultRoles } from 'utils/userRoles'

beforeEach(() => localStorage.clear())

describe('UsersTable', () => {
  it('renders the column headers', () => {
    renderWithProviders(<UsersTable userRights={userDefaultRoles} />)
    expect(screen.getByText('Identifiant APH')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})
