import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('should render the footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should contain current year copyright', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByRole('contentinfo').textContent).toContain(year)
  })

  it('should contain PGStudy branding', () => {
    render(<Footer />)
    expect(screen.getByText(/PGStudy/)).toBeInTheDocument()
  })

  it('should contain link to PostgreSQL official docs', () => {
    render(<Footer />)
    const link = screen.getByText('PostgreSQL 공식 문서').closest('a')
    expect(link).toHaveAttribute('href', 'https://www.postgresql.org/docs/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
