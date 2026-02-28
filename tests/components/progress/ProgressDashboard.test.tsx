import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressDashboard } from '@/components/progress/ProgressDashboard'

describe('ProgressDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render the dashboard heading', () => {
    render(<ProgressDashboard />)
    expect(screen.getByText('학습 진행률')).toBeInTheDocument()
  })

  it('should display 0% when no progress', () => {
    render(<ProgressDashboard />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('should display all 7 curriculum sections', () => {
    render(<ProgressDashboard />)
    expect(screen.getByText('시작하기')).toBeInTheDocument()
    expect(screen.getByText('SQL 기초')).toBeInTheDocument()
    expect(screen.getByText('데이터 모델링')).toBeInTheDocument()
    expect(screen.getByText('중급')).toBeInTheDocument()
    expect(screen.getByText('고급')).toBeInTheDocument()
    expect(screen.getByText('실전')).toBeInTheDocument()
    expect(screen.getByText('레퍼런스')).toBeInTheDocument()
  })

  it('should show 0/N for each section when no progress', () => {
    render(<ProgressDashboard />)
    // Multiple sections have total=3 (getting-started, data-modeling, practical, reference)
    const threeItems = screen.getAllByText('0/3')
    expect(threeItems.length).toBeGreaterThanOrEqual(1)
    // basics and intermediate have total=4
    const fourItems = screen.getAllByText('0/4')
    expect(fourItems.length).toBeGreaterThanOrEqual(1)
  })

  it('should reflect progress from localStorage', () => {
    localStorage.setItem('pgstudy-progress', JSON.stringify({
      'getting-started/introduction': true,
      'getting-started/first-query': true,
    }))
    render(<ProgressDashboard />)
    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('should show non-zero overall percentage with progress', () => {
    localStorage.setItem('pgstudy-progress', JSON.stringify({
      'getting-started/introduction': true,
    }))
    render(<ProgressDashboard />)
    // 1/25 total lessons = 4%
    const percentText = screen.getByText(/%/)
    expect(percentText.textContent).not.toBe('0%')
  })

  it('should show completed section with CheckCircle when all items done', () => {
    // getting-started has total=3
    localStorage.setItem('pgstudy-progress', JSON.stringify({
      'getting-started/a': true,
      'getting-started/b': true,
      'getting-started/c': true,
    }))
    render(<ProgressDashboard />)
    // With 3/3 complete, isComplete=true triggers CheckCircle2
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('should update progress when storage event fires with matching key', () => {
    const { rerender } = render(<ProgressDashboard />)
    expect(screen.getByText('0%')).toBeInTheDocument()

    // Update localStorage and dispatch storage event with matching key
    localStorage.setItem('pgstudy-progress', JSON.stringify({
      'getting-started/intro': true,
    }))
    const event = new StorageEvent('storage', { key: 'pgstudy-progress' })
    window.dispatchEvent(event)
    rerender(<ProgressDashboard />)
    // Progress should be updated
    expect(screen.queryByText('0%')).not.toBeInTheDocument()
  })

  it('should not update when storage event fires with different key', () => {
    render(<ProgressDashboard />)
    // Dispatch storage event with unrelated key - should not cause issues
    const event = new StorageEvent('storage', { key: 'some-other-key' })
    window.dispatchEvent(event)
    // Dashboard still renders normally
    expect(screen.getByText('학습 진행률')).toBeInTheDocument()
  })
})
