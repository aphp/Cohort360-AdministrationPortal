import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

import NoRights from './NoRights'
import { renderWithProviders } from 'test/renderWithProviders'

describe('NoRights', () => {
  it('renders the no-access message', () => {
    renderWithProviders(<NoRights />)
    expect(screen.getByText(/Vous n'avez pas accès au Portail/i)).toBeInTheDocument()
  })

  it('reloads the route when the back button is clicked', async () => {
    navigate.mockClear()
    renderWithProviders(<NoRights />)
    await userEvent.click(screen.getByRole('button', { name: /Retour à la connexion/i }))
    expect(navigate).toHaveBeenCalledWith(0)
  })
})
