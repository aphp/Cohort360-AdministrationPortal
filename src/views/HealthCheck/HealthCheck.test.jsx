import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HealthCheck from './HealthCheck'

describe('HealthCheck', () => {
  it('renders the ok message', () => {
    render(<HealthCheck />)
    expect(screen.getByText('Health check ok')).toBeInTheDocument()
  })
})
