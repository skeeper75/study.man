'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import type { ReactNode } from 'react'

const sectionLabels: Record<string, string> = {
  'getting-started': '시작하기',
  basics: 'SQL 기초',
  'data-modeling': '데이터 모델링',
  intermediate: '중급',
  advanced: '고급',
  practical: '실전',
  reference: '레퍼런스',
}

export function Breadcrumb(): ReactNode {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label =
      sectionLabels[segment] ??
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    const isLast = index === segments.length - 1

    return { href, label, isLast }
  })

  return (
    <nav className="mb-4 text-sm" aria-label="브레드크럼">
      <ol className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
        <li>
          <a
            href="/"
            className="flex items-center hover:text-primary-500 transition-colors"
            aria-label="홈"
          >
            <Home size={14} />
          </a>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight size={12} className="text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
            {crumb.isLast ? (
              <span className="font-medium text-neutral-800 dark:text-neutral-200" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <a href={crumb.href} className="hover:text-primary-500 transition-colors">
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
