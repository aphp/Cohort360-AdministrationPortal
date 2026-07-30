import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('forwards typed input through onChangeInput', async () => {
    const onChange = vi.fn()
    render(<SearchBar searchInput="" onChangeInput={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Rechercher'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows the clear button only when input is not empty', () => {
    const { rerender } = render(<SearchBar searchInput="" onChangeInput={() => undefined} />)
    expect(screen.queryByTestId('ClearIcon')).not.toBeInTheDocument()
    rerender(<SearchBar searchInput="foo" onChangeInput={() => undefined} />)
    expect(screen.getByTestId('ClearIcon')).toBeInTheDocument()
  })

  it('clears the input when the clear icon is clicked', async () => {
    const onChange = vi.fn()
    render(<SearchBar searchInput="foo" onChangeInput={onChange} />)
    await userEvent.click(screen.getByTestId('ClearIcon'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
