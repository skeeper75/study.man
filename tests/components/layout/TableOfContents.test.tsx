import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TableOfContents, type TocItem } from '@/components/layout/TableOfContents'

const mockItems: TocItem[] = [
  { id: 'introduction', value: 'Introduction', depth: 2 },
  { id: 'basic-syntax', value: 'Basic Syntax', depth: 2 },
  { id: 'examples', value: 'Examples', depth: 3 },
  { id: 'advanced', value: 'Advanced Usage', depth: 2 },
]

describe('TableOfContents', () => {
  it('should render headings as links', () => {
    render(<TableOfContents items={mockItems} />)
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Basic Syntax')).toBeInTheDocument()
    expect(screen.getByText('Examples')).toBeInTheDocument()
    expect(screen.getByText('Advanced Usage')).toBeInTheDocument()
  })

  it('should render links with correct anchor href', () => {
    render(<TableOfContents items={mockItems} />)
    const link = screen.getByText('Introduction').closest('a')
    expect(link).toHaveAttribute('href', '#introduction')
  })

  it('should indent deeper headings with padding', () => {
    render(<TableOfContents items={mockItems} />)
    const h3Link = screen.getByText('Examples').closest('a')
    expect(h3Link?.className).toContain('pl-4')
  })

  it('should not indent depth-2 headings', () => {
    render(<TableOfContents items={mockItems} />)
    const h2Link = screen.getByText('Introduction').closest('a')
    expect(h2Link?.className).not.toContain('pl-4')
  })

  it('should have accessible navigation role with label', () => {
    render(<TableOfContents items={mockItems} />)
    expect(screen.getByRole('navigation', { name: '목차' })).toBeInTheDocument()
  })

  it('should return null when items are empty', () => {
    const { container } = render(<TableOfContents items={[]} />)
    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })

  it('should render the "목차" heading', () => {
    render(<TableOfContents items={mockItems} />)
    expect(screen.getByText('목차')).toBeInTheDocument()
  })
})
