import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('should render badge text', () => {
    render(<Badge>beginner</Badge>)
    expect(screen.getByText('beginner')).toBeInTheDocument()
  })

  it('should apply default variant styling', () => {
    render(<Badge>default</Badge>)
    expect(screen.getByText('default').className).toContain('bg-neutral-100')
  })

  it('should apply beginner difficulty color (green/success)', () => {
    render(<Badge variant="beginner">beginner</Badge>)
    expect(screen.getByText('beginner').className).toContain('bg-success-50')
  })

  it('should apply intermediate difficulty color (yellow/warning)', () => {
    render(<Badge variant="intermediate">intermediate</Badge>)
    expect(screen.getByText('intermediate').className).toContain('bg-warning-50')
  })

  it('should apply advanced difficulty color (red/error)', () => {
    render(<Badge variant="advanced">advanced</Badge>)
    expect(screen.getByText('advanced').className).toContain('bg-error-50')
  })

  it('should apply version variant styling', () => {
    render(<Badge variant="version">PG 13+</Badge>)
    expect(screen.getByText('PG 13+').className).toContain('bg-info-50')
  })

  it('should render as inline-flex span element', () => {
    render(<Badge>test</Badge>)
    const badge = screen.getByText('test')
    expect(badge.tagName).toBe('SPAN')
    expect(badge.className).toContain('inline-flex')
  })

  it('should accept custom className', () => {
    render(<Badge className="custom-class">test</Badge>)
    expect(screen.getByText('test').className).toContain('custom-class')
  })
})
