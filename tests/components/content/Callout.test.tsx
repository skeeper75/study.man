import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Callout } from '@/components/content/Callout'

describe('Callout', () => {
  it('should render info callout with correct styling', () => {
    render(<Callout type="info">Helpful information</Callout>)
    expect(screen.getByText('Helpful information')).toBeInTheDocument()
    const container = screen.getByRole('note')
    expect(container.className).toContain('border-info-500')
  })

  it('should render warning callout with correct styling', () => {
    render(<Callout type="warning">Be careful!</Callout>)
    expect(screen.getByText('Be careful!')).toBeInTheDocument()
    const container = screen.getByRole('note')
    expect(container.className).toContain('border-warning-500')
  })

  it('should render tip callout with correct styling', () => {
    render(<Callout type="tip">Pro tip here</Callout>)
    expect(screen.getByText('Pro tip here')).toBeInTheDocument()
    const container = screen.getByRole('note')
    expect(container.className).toContain('border-success-500')
  })

  it('should render error callout with correct styling', () => {
    render(<Callout type="error">Error occurred</Callout>)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
    const container = screen.getByRole('note')
    expect(container.className).toContain('border-error-500')
  })

  it('should use default title based on type', () => {
    render(<Callout type="info">Content</Callout>)
    expect(screen.getByText('참고')).toBeInTheDocument()
  })

  it('should allow custom title override', () => {
    render(<Callout type="info" title="Custom Title">Content</Callout>)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('should have role="note" for accessibility', () => {
    render(<Callout>Content</Callout>)
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it('should render icon with aria-hidden for accessibility', () => {
    const { container } = render(<Callout type="info">Content</Callout>)
    const icon = container.querySelector('[aria-hidden="true"]')
    expect(icon).toBeInTheDocument()
  })
})
