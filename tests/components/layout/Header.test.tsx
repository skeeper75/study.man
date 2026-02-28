import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  })),
}))

import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('should render the header banner element', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the PGStudy brand name', () => {
    render(<Header />)
    expect(screen.getByText('PG')).toBeInTheDocument()
    expect(screen.getByText('Study')).toBeInTheDocument()
  })

  it('should render a theme toggle button', () => {
    render(<Header />)
    const button = screen.getByLabelText(/모드로 전환/)
    expect(button).toBeInTheDocument()
  })

  it('should render a search trigger button', () => {
    render(<Header />)
    expect(screen.getByLabelText('검색')).toBeInTheDocument()
  })

  it('should call onSearchOpen when search button is clicked', () => {
    const onSearchOpen = vi.fn()
    render(<Header onSearchOpen={onSearchOpen} />)
    fireEvent.click(screen.getByLabelText('검색'))
    expect(onSearchOpen).toHaveBeenCalledTimes(1)
  })

  it('should render Ctrl+K keyboard shortcut hint', () => {
    render(<Header />)
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument()
  })

  it('should render mobile hamburger menu button', () => {
    render(<Header />)
    expect(screen.getByLabelText('메뉴 열기')).toBeInTheDocument()
  })

  it('should toggle mobile menu label on click', () => {
    render(<Header />)
    const menuButton = screen.getByLabelText('메뉴 열기')
    fireEvent.click(menuButton)
    expect(screen.getByLabelText('메뉴 닫기')).toBeInTheDocument()
  })

  it('should render home link pointing to /', () => {
    render(<Header />)
    const homeLink = screen.getByText('PG').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
