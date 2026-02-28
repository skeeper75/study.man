import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/basics/select'),
}))

import { Breadcrumb } from '@/components/navigation/Breadcrumb'

describe('Breadcrumb', () => {
  it('should render breadcrumb navigation with aria-label', () => {
    render(<Breadcrumb />)
    expect(screen.getByRole('navigation', { name: '브레드크럼' })).toBeInTheDocument()
  })

  it('should render home link', () => {
    render(<Breadcrumb />)
    expect(screen.getByLabelText('홈')).toBeInTheDocument()
    const homeLink = screen.getByLabelText('홈').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('should render section label from sectionLabels map', () => {
    render(<Breadcrumb />)
    // "basics" maps to "SQL 기초"
    expect(screen.getByText('SQL 기초')).toBeInTheDocument()
  })

  it('should render last segment with aria-current="page"', () => {
    render(<Breadcrumb />)
    const lastSegment = screen.getByText('Select')
    expect(lastSegment).toHaveAttribute('aria-current', 'page')
  })

  it('should render intermediate segments as links', () => {
    render(<Breadcrumb />)
    const sectionLink = screen.getByText('SQL 기초').closest('a')
    expect(sectionLink).toHaveAttribute('href', '/basics')
  })

  it('should render last segment as plain text (not a link)', () => {
    render(<Breadcrumb />)
    const lastSegment = screen.getByText('Select')
    expect(lastSegment.tagName).toBe('SPAN')
    expect(lastSegment.closest('a')).toBeNull()
  })

  it('should render separator icons between segments', () => {
    const { container } = render(<Breadcrumb />)
    const separators = container.querySelectorAll('[aria-hidden="true"]')
    expect(separators.length).toBeGreaterThan(0)
  })
})
