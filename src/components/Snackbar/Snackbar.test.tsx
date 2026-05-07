import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommonSnackbar from './Snackbar'

describe('CommonSnackbar', () => {
  it('renders the message with the given severity', () => {
    render(<CommonSnackbar message="Saved!" severity="success" onClose={() => undefined} />)
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardSuccess')
  })

  it('calls onClose when the alert close button is clicked', async () => {
    const onClose = vi.fn()
    render(<CommonSnackbar message="Oops" severity="error" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
