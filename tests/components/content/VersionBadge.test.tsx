import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VersionBadge } from '@/components/content/VersionBadge'

describe('VersionBadge', () => {
  it('should render the PostgreSQL version with PG prefix', () => {
    render(<VersionBadge version={13} />)
    expect(screen.getByText('PG 13+')).toBeInTheDocument()
  })

  it('should render different versions correctly', () => {
    render(<VersionBadge version={16} />)
    expect(screen.getByText('PG 16+')).toBeInTheDocument()
  })

  it('should use the version Badge variant', () => {
    render(<VersionBadge version={13} />)
    const badge = screen.getByText('PG 13+')
    expect(badge.className).toContain('bg-info-50')
  })

  it('should accept custom className', () => {
    render(<VersionBadge version={13} className="custom" />)
    const badge = screen.getByText('PG 13+')
    expect(badge.className).toContain('custom')
  })
})
