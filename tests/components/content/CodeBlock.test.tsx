import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CodeBlock } from '@/components/content/CodeBlock'

describe('CodeBlock', () => {
  it('should render SQL code content', () => {
    render(<CodeBlock>SELECT * FROM users</CodeBlock>)
    expect(screen.getByText('SELECT * FROM users')).toBeInTheDocument()
  })

  it('should apply language class for syntax highlighting', () => {
    const { container } = render(<CodeBlock language="sql">SELECT 1</CodeBlock>)
    const code = container.querySelector('code')
    expect(code?.className).toContain('language-sql')
  })

  it('should render a copy button', () => {
    render(<CodeBlock>SELECT 1</CodeBlock>)
    expect(screen.getByLabelText('코드 복사')).toBeInTheDocument()
  })

  it('should copy code to clipboard when copy button is clicked', async () => {
    render(<CodeBlock>SELECT 1</CodeBlock>)
    fireEvent.click(screen.getByLabelText('코드 복사'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('SELECT 1')
  })

  it('should show confirmation after copying', async () => {
    render(<CodeBlock>SELECT 1</CodeBlock>)
    await fireEvent.click(screen.getByLabelText('코드 복사'))
    // After async clipboard write completes, aria-label changes to '복사됨'
    const { findByLabelText } = await import('@testing-library/react')
    expect(await screen.findByLabelText('복사됨')).toBeInTheDocument()
  })

  it('should show playground link when showPlayground is true', () => {
    render(<CodeBlock showPlayground>SELECT 1</CodeBlock>)
    expect(screen.getByLabelText('플레이그라운드에서 실행')).toBeInTheDocument()
  })

  it('should not show playground link when showPlayground is false', () => {
    render(<CodeBlock>SELECT 1</CodeBlock>)
    expect(screen.queryByLabelText('플레이그라운드에서 실행')).not.toBeInTheDocument()
  })

  it('should render filename header when provided', () => {
    render(<CodeBlock filename="query.sql">SELECT 1</CodeBlock>)
    expect(screen.getByText('query.sql')).toBeInTheDocument()
  })

  it('should render line numbers when showLineNumbers is true', () => {
    render(<CodeBlock showLineNumbers>{'SELECT 1\nSELECT 2'}</CodeBlock>)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should have horizontally scrollable pre element', () => {
    const { container } = render(<CodeBlock>SELECT 1</CodeBlock>)
    const pre = container.querySelector('pre')
    expect(pre?.className).toContain('overflow-x-auto')
  })
})
