import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface NavLink {
  title: string
  href: string
}

interface PrevNextProps {
  prev?: NavLink
  next?: NavLink
}

export function PrevNext({ prev, next }: PrevNextProps): ReactNode {
  if (!prev && !next) return null

  return (
    <nav
      className="mt-12 flex items-stretch justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800"
      aria-label="이전/다음 페이지"
    >
      {prev ? (
        <a
          href={prev.href}
          className="group flex flex-1 items-center gap-2 rounded-lg border border-neutral-200 p-4 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-800 dark:hover:border-primary-700 dark:hover:bg-primary-950"
        >
          <ChevronLeft
            size={16}
            className="text-neutral-400 group-hover:text-primary-500"
          />
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              이전
            </div>
            <div className="font-medium text-neutral-800 group-hover:text-primary-600 dark:text-neutral-200 dark:group-hover:text-primary-400">
              {prev.title}
            </div>
          </div>
        </a>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <a
          href={next.href}
          className="group flex flex-1 items-center justify-end gap-2 rounded-lg border border-neutral-200 p-4 text-sm text-right transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-800 dark:hover:border-primary-700 dark:hover:bg-primary-950"
        >
          <div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              다음
            </div>
            <div className="font-medium text-neutral-800 group-hover:text-primary-600 dark:text-neutral-200 dark:group-hover:text-primary-400">
              {next.title}
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-neutral-400 group-hover:text-primary-500"
          />
        </a>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}

export type { PrevNextProps, NavLink }
