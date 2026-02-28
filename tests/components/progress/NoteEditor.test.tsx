import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NoteEditor } from '@/components/progress/NoteEditor'

describe('NoteEditor', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render the toggle button', () => {
    render(<NoteEditor pageId="basics/select" />)
    expect(screen.getByText('메모 작성')).toBeInTheDocument()
  })

  it('should expand on click to show textarea', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    expect(screen.getByLabelText('메모')).toBeInTheDocument()
  })

  it('should show save button after expanding', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    expect(screen.getByText('저장')).toBeInTheDocument()
  })

  it('should save note to localStorage', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    const textarea = screen.getByLabelText('메모') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'My test note' } })
    fireEvent.click(screen.getByText('저장'))
    const stored = JSON.parse(localStorage.getItem('pgstudy-notes') ?? '{}')
    expect(stored['basics/select']).toBe('My test note')
  })

  it('should load existing note from localStorage', () => {
    localStorage.setItem('pgstudy-notes', JSON.stringify({ 'basics/select': 'Existing note' }))
    render(<NoteEditor pageId="basics/select" />)
    // When note exists, should show "내 메모" and preview
    expect(screen.getByText('내 메모')).toBeInTheDocument()
  })

  it('should show delete button when note exists', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    const textarea = screen.getByLabelText('메모') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'Note to delete' } })
    expect(screen.getByText('삭제')).toBeInTheDocument()
  })

  it('should have aria-expanded attribute on toggle button', () => {
    render(<NoteEditor pageId="basics/select" />)
    const toggle = screen.getByText('메모 작성').closest('button')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle!)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('should delete note when clicking 삭제 button', () => {
    localStorage.setItem('pgstudy-notes', JSON.stringify({ 'basics/select': 'Note to delete' }))
    render(<NoteEditor pageId="basics/select" />)
    // Component auto-expands when note exists - don't need to click again
    fireEvent.click(screen.getByText('삭제'))
    const stored = JSON.parse(localStorage.getItem('pgstudy-notes') ?? '{}')
    expect(stored['basics/select']).toBeUndefined()
  })

  it('should save empty note and delete it from storage', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    const textarea = screen.getByLabelText('메모') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'temp' } })
    fireEvent.change(textarea, { target: { value: '' } })
    fireEvent.click(screen.getByText('저장'))
    const stored = JSON.parse(localStorage.getItem('pgstudy-notes') ?? '{}')
    expect(stored['basics/select']).toBeUndefined()
  })

  it('should save note with Ctrl+S keyboard shortcut', () => {
    render(<NoteEditor pageId="basics/select" />)
    fireEvent.click(screen.getByText('메모 작성'))
    const textarea = screen.getByLabelText('메모') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'Keyboard saved note' } })
    fireEvent.keyDown(textarea, { key: 's', ctrlKey: true })
    const stored = JSON.parse(localStorage.getItem('pgstudy-notes') ?? '{}')
    expect(stored['basics/select']).toBe('Keyboard saved note')
  })
})
