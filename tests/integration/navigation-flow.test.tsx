import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/basics/select',
}))

import { PrevNext } from '@/components/navigation/PrevNext'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'

describe('Navigation Flow Integration', () => {
  describe('sidebar -> content -> PrevNext navigation', () => {
    it('should render PrevNext with correct links when both prev and next exist', () => {
      // FR-001: hierarchical structure with navigation
      render(
        <PrevNext
          prev={{ href: '/getting-started/setup', title: 'Setup' }}
          next={{ href: '/basics/filtering', title: 'Filtering' }}
        />,
      )
      expect(screen.getByText('Setup')).toBeInTheDocument()
      expect(screen.getByText('Filtering')).toBeInTheDocument()
    })

    it('should navigate to next lesson in curriculum sequence', () => {
      // FR-001: navigation to next lesson
      render(
        <PrevNext
          prev={{ href: '/basics/select', title: 'SELECT Basics' }}
          next={{ href: '/basics/filtering', title: 'Filtering with WHERE' }}
        />,
      )
      const nextLink = screen.getByText('Filtering with WHERE').closest('a')
      expect(nextLink).toHaveAttribute('href', '/basics/filtering')
    })

    it('should navigate to previous lesson in curriculum sequence', () => {
      render(
        <PrevNext
          prev={{ href: '/basics/select', title: 'SELECT Basics' }}
          next={{ href: '/basics/joins', title: 'JOIN Types' }}
        />,
      )
      const prevLink = screen.getByText('SELECT Basics').closest('a')
      expect(prevLink).toHaveAttribute('href', '/basics/select')
    })

    it('should handle first lesson (no previous)', () => {
      // Edge case: first lesson in the curriculum
      render(
        <PrevNext
          next={{ href: '/getting-started/first-query', title: 'First Query' }}
        />,
      )
      expect(screen.getByText('First Query')).toBeInTheDocument()
      expect(screen.queryByText(/이전/)).not.toBeInTheDocument()
    })

    it('should handle last lesson (no next)', () => {
      // Edge case: last lesson in the curriculum
      render(
        <PrevNext
          prev={{ href: '/reference/errors', title: 'Error Codes' }}
        />,
      )
      expect(screen.getByText('Error Codes')).toBeInTheDocument()
      expect(screen.queryByText(/다음/)).not.toBeInTheDocument()
    })

    it('should render breadcrumb with current path context', () => {
      // Breadcrumb shows current location in curriculum
      render(<Breadcrumb />)
      const nav = screen.getByLabelText('브레드크럼')
      expect(nav).toBeInTheDocument()
    })

    it('should show correct breadcrumb hierarchy for nested page', () => {
      // e.g., Home > SQL 기초 > SELECT
      render(<Breadcrumb />)
      // Should have home link and at least one section
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThanOrEqual(1)
    })
  })
})
