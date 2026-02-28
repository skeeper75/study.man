import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PrevNext } from '@/components/navigation/PrevNext'

describe('PrevNext', () => {
  it('should render both previous and next links', () => {
    render(
      <PrevNext
        prev={{ title: 'Introduction', href: '/getting-started/intro' }}
        next={{ title: 'Filtering', href: '/basics/filtering' }}
      />
    )
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Filtering')).toBeInTheDocument()
  })

  it('should render "이전" and "다음" labels', () => {
    render(
      <PrevNext
        prev={{ title: 'Intro', href: '/intro' }}
        next={{ title: 'Next', href: '/next' }}
      />
    )
    expect(screen.getByText('이전')).toBeInTheDocument()
    expect(screen.getByText('다음')).toBeInTheDocument()
  })

  it('should render links with correct href', () => {
    render(
      <PrevNext
        prev={{ title: 'Intro', href: '/getting-started/intro' }}
        next={{ title: 'Filter', href: '/basics/filtering' }}
      />
    )
    expect(screen.getByText('Intro').closest('a')).toHaveAttribute('href', '/getting-started/intro')
    expect(screen.getByText('Filter').closest('a')).toHaveAttribute('href', '/basics/filtering')
  })

  it('should render only next link when no previous page', () => {
    render(<PrevNext next={{ title: 'First Query', href: '/getting-started/first-query' }} />)
    expect(screen.getByText('First Query')).toBeInTheDocument()
    expect(screen.queryByText('이전')).not.toBeInTheDocument()
  })

  it('should render only previous link when no next page', () => {
    render(<PrevNext prev={{ title: 'Last Lesson', href: '/practical/last' }} />)
    expect(screen.getByText('Last Lesson')).toBeInTheDocument()
    expect(screen.queryByText('다음')).not.toBeInTheDocument()
  })

  it('should return null when neither prev nor next is provided', () => {
    const { container } = render(<PrevNext />)
    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })

  it('should have navigation role with aria-label', () => {
    render(
      <PrevNext
        prev={{ title: 'Intro', href: '/intro' }}
        next={{ title: 'Next', href: '/next' }}
      />
    )
    expect(screen.getByRole('navigation', { name: '이전/다음 페이지' })).toBeInTheDocument()
  })
})
