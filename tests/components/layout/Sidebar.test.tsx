import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/basics/select'),
}))

import { Sidebar } from '@/components/layout/Sidebar'

const mockItems = [
  {
    title: '시작하기',
    href: '/getting-started',
    children: [
      { title: '소개', href: '/getting-started/introduction' },
      { title: '첫 번째 쿼리', href: '/getting-started/first-query' },
    ],
  },
  {
    title: 'SQL 기초',
    href: '/basics',
    children: [
      { title: 'SELECT', href: '/basics/select' },
      { title: 'WHERE', href: '/basics/filtering' },
    ],
  },
]

describe('Sidebar', () => {
  it('should render navigation element with aria-label', () => {
    render(<Sidebar items={mockItems} />)
    expect(screen.getByRole('navigation', { name: '사이드바 내비게이션' })).toBeInTheDocument()
  })

  it('should render all section titles', () => {
    render(<Sidebar items={mockItems} />)
    expect(screen.getByText('시작하기')).toBeInTheDocument()
    expect(screen.getByText('SQL 기초')).toBeInTheDocument()
  })

  it('should render child items', () => {
    render(<Sidebar items={mockItems} />)
    expect(screen.getByText('소개')).toBeInTheDocument()
    expect(screen.getByText('첫 번째 쿼리')).toBeInTheDocument()
    expect(screen.getByText('SELECT')).toBeInTheDocument()
  })

  it('should render items as links with correct href', () => {
    render(<Sidebar items={mockItems} />)
    const selectLink = screen.getByText('SELECT').closest('a')
    expect(selectLink).toHaveAttribute('href', '/basics/select')
  })

  it('should highlight the current page with aria-current="page"', () => {
    render(<Sidebar items={mockItems} />)
    const activeLink = screen.getByText('SELECT').closest('a')
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })

  it('should not mark non-active items with aria-current', () => {
    render(<Sidebar items={mockItems} />)
    const inactiveLink = screen.getByText('WHERE').closest('a')
    expect(inactiveLink).not.toHaveAttribute('aria-current')
  })

  it('should apply active styling to current page', () => {
    render(<Sidebar items={mockItems} />)
    const activeLink = screen.getByText('SELECT').closest('a')
    expect(activeLink?.className).toContain('bg-primary-50')
  })
})
