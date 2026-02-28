'use client'

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type ReactElement,
} from 'react'

interface TooltipProps {
  content: string
  children: ReactElement
  side?: 'top' | 'bottom'
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  className = '',
}: TooltipProps): ReactNode {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(true), 200)
  }, [])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }, [])

  const positionClass = side === 'top'
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2'

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-md whitespace-nowrap pointer-events-none ${positionClass} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export type { TooltipProps }
