import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookmarkButton } from '@/components/progress/BookmarkButton'

describe('BookmarkButton', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render as unbookmarked by default', () => {
    render(<BookmarkButton pageId="basics/select" />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-label', '북마크 추가')
  })

  it('should display "북마크" text when not bookmarked', () => {
    render(<BookmarkButton pageId="basics/select" />)
    expect(screen.getByText('북마크')).toBeInTheDocument()
  })

  it('should toggle to bookmarked on click', () => {
    render(<BookmarkButton pageId="basics/select" />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', '북마크 제거')
    expect(screen.getByText('북마크됨')).toBeInTheDocument()
  })

  it('should persist bookmark to localStorage', () => {
    render(<BookmarkButton pageId="basics/select" />)
    fireEvent.click(screen.getByRole('button'))
    const stored = JSON.parse(localStorage.getItem('pgstudy-bookmarks') ?? '{}')
    expect(stored['basics/select']).toBe(true)
  })

  it('should toggle back to unbookmarked on second click', () => {
    render(<BookmarkButton pageId="basics/select" />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('북마크')).toBeInTheDocument()
  })
})
