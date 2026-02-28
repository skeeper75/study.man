import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tooltip } from '@/components/ui/Tooltip'

describe('Tooltip', () => {
  it('should not display tooltip content by default', () => {
    render(
      <Tooltip content="Helpful info">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should render the trigger element', () => {
    render(
      <Tooltip content="Helpful info">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('should show tooltip on focus for keyboard accessibility', async () => {
    render(
      <Tooltip content="Keyboard info">
        <button>Focus me</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('Focus me'))
    // Tooltip has a 200ms delay
    await new Promise((r) => setTimeout(r, 250))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Keyboard info')
  })

  it('should hide tooltip on blur', async () => {
    render(
      <Tooltip content="Info">
        <button>Focus me</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('Focus me'))
    await new Promise((r) => setTimeout(r, 250))
    fireEvent.blur(screen.getByText('Focus me'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should have role="tooltip" on the tooltip element', async () => {
    render(
      <Tooltip content="ARIA test">
        <button>Hover</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('Hover'))
    await new Promise((r) => setTimeout(r, 250))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })

  it('should position tooltip at bottom when side is bottom', async () => {
    render(
      <Tooltip content="Bottom tip" side="bottom">
        <button>Hover me</button>
      </Tooltip>
    )
    fireEvent.focus(screen.getByText('Hover me'))
    await new Promise((r) => setTimeout(r, 250))
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip.className).toContain('top-full')
  })

  it('should clear pending show timeout when hide is called quickly', async () => {
    render(
      <Tooltip content="Quick hide">
        <button>Hover</button>
      </Tooltip>
    )
    const btn = screen.getByText('Hover')
    fireEvent.focus(btn)
    // Immediately blur before 200ms delay
    fireEvent.blur(btn)
    // Tooltip should not appear since hide clears the timeout
    await new Promise((r) => setTimeout(r, 250))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should clear pending timeout when show is called again', async () => {
    render(
      <Tooltip content="Rapid focus">
        <button>Hover</button>
      </Tooltip>
    )
    const btn = screen.getByText('Hover')
    // Focus twice rapidly - the second call should clear the first timeout
    fireEvent.focus(btn)
    fireEvent.focus(btn)
    await new Promise((r) => setTimeout(r, 250))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
  })
})
