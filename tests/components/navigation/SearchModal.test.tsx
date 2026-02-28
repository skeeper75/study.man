import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockSearchResults = [
  {
    id: 'basics/select',
    title: 'SELECT Basics',
    href: '/basics/select',
    preview: 'Learn the fundamentals of SQL SELECT...',
    breadcrumb: 'SQL 기초 > SELECT',
    difficulty: 'beginner' as const,
    content: 'SELECT statement content',
    score: 1,
    section: 'basics',
  },
  {
    id: 'intermediate/joins',
    title: 'JOIN Types',
    href: '/intermediate/joins',
    preview: 'INNER JOIN, LEFT JOIN explained...',
    breadcrumb: '중급 > JOIN',
    difficulty: 'intermediate' as const,
    content: 'JOIN content',
    score: 0.8,
    section: 'intermediate',
  },
]

vi.mock('@/lib/search', () => ({
  search: vi.fn().mockResolvedValue(mockSearchResults),
}))

import { SearchModal } from '@/components/navigation/SearchModal'

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when open is false', () => {
    render(<SearchModal open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render dialog when open is true', () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should have aria-modal and aria-label on dialog', () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', '사이트 검색')
  })

  it('should render search input with correct label', () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    expect(screen.getByLabelText('검색어 입력')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<SearchModal open={true} onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('검색 닫기'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<SearchModal open={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('should show placeholder text when no query', () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    expect(screen.getByText('검색어를 입력하세요')).toBeInTheDocument()
  })

  it('should render keyboard shortcut instructions in footer', () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    expect(screen.getByText('이동')).toBeInTheDocument()
    expect(screen.getByText('열기')).toBeInTheDocument()
    expect(screen.getByText('닫기')).toBeInTheDocument()
  })

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<SearchModal open={true} onClose={onClose} />)
    const backdrop = screen.getByRole('dialog').querySelector('[aria-hidden="true"]')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('should display search results after typing query', async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })

    await waitFor(() => {
      expect(screen.getByText('SELECT Basics')).toBeInTheDocument()
    })
    expect(screen.getByText('JOIN Types')).toBeInTheDocument()
  })

  it('should show result breadcrumbs', async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })

    await waitFor(() => {
      expect(screen.getByText('SQL 기초 > SELECT')).toBeInTheDocument()
    })
  })

  it('should show no results message when search returns empty', async () => {
    const { search } = await import('@/lib/search')
    vi.mocked(search).mockResolvedValueOnce([])

    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'xyznotfound' } })

    await waitFor(() => {
      expect(screen.getByText(/"xyznotfound"에 대한 결과가 없습니다/)).toBeInTheDocument()
    })
  })

  it('should clear results when query is empty', async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })
    await waitFor(() => expect(screen.getByText('SELECT Basics')).toBeInTheDocument())

    fireEvent.change(input, { target: { value: '' } })
    await waitFor(() => {
      expect(screen.queryByText('SELECT Basics')).not.toBeInTheDocument()
    })
  })

  it('should move selection down with ArrowDown key', async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })
    await waitFor(() => expect(screen.getByText('SELECT Basics')).toBeInTheDocument())

    // First result should be selected by default (index 0)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    // Second result (index 1) should now be selected
    const items = screen.getAllByRole('option')
    expect(items[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('should move selection up with ArrowUp key', async () => {
    render(<SearchModal open={true} onClose={vi.fn()} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })
    await waitFor(() => expect(screen.getByText('SELECT Basics')).toBeInTheDocument())

    // Move down then up
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    // First result should be selected again
    const items = screen.getAllByRole('option')
    expect(items[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('should call onClose when result link is clicked', async () => {
    const onClose = vi.fn()
    render(<SearchModal open={true} onClose={onClose} />)
    const input = screen.getByLabelText('검색어 입력')
    fireEvent.change(input, { target: { value: 'SELECT' } })
    await waitFor(() => expect(screen.getByText('SELECT Basics')).toBeInTheDocument())

    fireEvent.click(screen.getByText('SELECT Basics'))
    expect(onClose).toHaveBeenCalled()
  })
})
