import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockQueryPGlite = vi.fn()

vi.mock('@/lib/pglite-worker', () => ({
  queryPGlite: mockQueryPGlite,
  initPGlite: vi.fn().mockResolvedValue(undefined),
}))

import { SQLPlayground } from '@/components/content/SQLPlayground'

describe('SQLPlayground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockQueryPGlite.mockResolvedValue({
      fields: [{ name: 'id' }, { name: 'name' }],
      rows: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
    })
  })

  it('should show activation trigger before loading', () => {
    render(<SQLPlayground />)
    expect(screen.getByText('SQL 플레이그라운드 활성화')).toBeInTheDocument()
  })

  it('should not show editor before activation', () => {
    render(<SQLPlayground />)
    expect(screen.queryByLabelText('SQL 쿼리 입력')).not.toBeInTheDocument()
  })

  it('should show editor after clicking activation button', () => {
    render(<SQLPlayground />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    expect(screen.getByLabelText('SQL 쿼리 입력')).toBeInTheDocument()
  })

  it('should populate default query after activation', () => {
    render(<SQLPlayground defaultQuery="SELECT 42" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    const textarea = screen.getByLabelText('SQL 쿼리 입력') as HTMLTextAreaElement
    expect(textarea.value).toBe('SELECT 42')
  })

  it('should render Run button with keyboard shortcut after activation', () => {
    render(<SQLPlayground />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    expect(screen.getByText('실행')).toBeInTheDocument()
    expect(screen.getByText('Ctrl+Enter')).toBeInTheDocument()
  })

  it('should render EXPLAIN ANALYZE toggle after activation', () => {
    render(<SQLPlayground />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    expect(screen.getByText('EXPLAIN ANALYZE')).toBeInTheDocument()
  })

  it('should toggle EXPLAIN ANALYZE button aria-pressed state', () => {
    render(<SQLPlayground />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    const toggle = screen.getByText('EXPLAIN ANALYZE').closest('button')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(toggle!)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })

  it('should render title when provided', () => {
    render(<SQLPlayground title="Basic SELECT" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    expect(screen.getByText('Basic SELECT')).toBeInTheDocument()
  })

  it('should allow editing the query text', () => {
    render(<SQLPlayground />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    const textarea = screen.getByLabelText('SQL 쿼리 입력') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'SELECT 99' } })
    expect(textarea.value).toBe('SELECT 99')
  })

  it('should disable Run button when query is empty', () => {
    render(<SQLPlayground defaultQuery="" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    const textarea = screen.getByLabelText('SQL 쿼리 입력') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: '' } })
    const runButton = screen.getByText('실행').closest('button')
    expect(runButton).toBeDisabled()
  })

  it('should execute query and display results', async () => {
    render(<SQLPlayground defaultQuery="SELECT * FROM users" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    fireEvent.click(screen.getByText('실행'))

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('id')).toBeInTheDocument()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('should display row count after query execution', async () => {
    render(<SQLPlayground defaultQuery="SELECT * FROM users" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    fireEvent.click(screen.getByText('실행'))

    await waitFor(() => {
      expect(screen.getByText(/2개 행/)).toBeInTheDocument()
    })
  })

  it('should show error message on query failure', async () => {
    mockQueryPGlite.mockRejectedValueOnce(new Error('ERROR  syntax error at position 5'))
    render(<SQLPlayground defaultQuery="INVALID SQL" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    fireEvent.click(screen.getByText('실행'))

    await waitFor(() => {
      expect(screen.getByText(/syntax error/)).toBeInTheDocument()
    })
  })

  it('should execute with EXPLAIN ANALYZE when toggled', async () => {
    render(<SQLPlayground defaultQuery="SELECT 1" />)
    fireEvent.click(screen.getByText('SQL 플레이그라운드 활성화'))
    const toggle = screen.getByText('EXPLAIN ANALYZE').closest('button')
    fireEvent.click(toggle!)
    fireEvent.click(screen.getByText('실행'))

    await waitFor(() => expect(mockQueryPGlite).toHaveBeenCalled())
    expect(mockQueryPGlite).toHaveBeenCalledWith(expect.stringContaining('EXPLAIN ANALYZE'))
  })
})
