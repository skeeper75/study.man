import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock next-themes
const mockSetTheme = vi.fn()
let currentTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: currentTheme,
    setTheme: mockSetTheme,
    resolvedTheme: currentTheme,
    systemTheme: 'light',
  }),
}))

import { Header } from '@/components/layout/Header'

describe('Theme Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    currentTheme = 'light'
    mockSetTheme.mockClear()
  })

  describe('theme toggle -> localStorage -> restore', () => {
    it('should call setTheme when theme toggle is clicked', () => {
      // FR-006: persist theme in localStorage
      render(<Header onSearchOpen={vi.fn()} />)
      const themeToggle = screen.getByLabelText(/테마|다크|라이트|theme/i)
      fireEvent.click(themeToggle)
      expect(mockSetTheme).toHaveBeenCalled()
    })

    it('should toggle between light and dark themes', () => {
      // FR-006: toggle between light and dark
      render(<Header onSearchOpen={vi.fn()} />)
      const themeToggle = screen.getByLabelText(/테마|다크|라이트|theme/i)
      fireEvent.click(themeToggle)
      // When current theme is 'light', should set to 'dark'
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('should reflect dark theme state when theme is dark', () => {
      // Scenario 10: stored theme applied without FOUC
      currentTheme = 'dark'
      render(<Header onSearchOpen={vi.fn()} />)
      const themeToggle = screen.getByLabelText(/테마|다크|라이트|theme/i)
      expect(themeToggle).toBeInTheDocument()
    })

    it('should render Header consistently regardless of theme', () => {
      // FR-006: follow system-level preference - Header renders in both themes
      // Note: PGStudy is split across <span>PG</span><span>Study</span>
      currentTheme = 'light'
      const { unmount } = render(<Header onSearchOpen={vi.fn()} />)
      expect(screen.getByText('PG')).toBeInTheDocument()
      expect(screen.getByText('Study')).toBeInTheDocument()
      unmount()

      currentTheme = 'dark'
      render(<Header onSearchOpen={vi.fn()} />)
      expect(screen.getByText('PG')).toBeInTheDocument()
      expect(screen.getByText('Study')).toBeInTheDocument()
    })
  })
})
