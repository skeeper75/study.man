'use client'

import { useEffect, useState, type ReactNode } from 'react'

interface TocItem {
  id: string
  value: string
  depth: number
}

interface TableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function TableOfContents({
  items,
  className = '',
}: TableOfContentsProps): ReactNode {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )

    for (const item of items) {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      className={`hidden xl:block w-56 shrink-0 ${className}`}
      aria-label="목차"
    >
      <div className="sticky top-20">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          목차
        </h3>
        <ul className="space-y-1.5 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block transition-colors ${
                  item.depth > 2 ? 'pl-4' : ''
                } ${
                  activeId === item.id
                    ? 'font-medium text-primary-500'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
                aria-current={activeId === item.id ? 'location' : undefined}
              >
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export type { TableOfContentsProps, TocItem }
