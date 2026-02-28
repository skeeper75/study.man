'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

interface SidebarItem {
  title: string
  href: string
  children?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

function SidebarLink({ item }: { item: SidebarItem }): ReactNode {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <li>
      <a
        href={item.href}
        className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-950 dark:text-primary-400'
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="ml-3 mt-1 space-y-1 border-l border-neutral-200 pl-3 dark:border-neutral-800">
          {item.children.map((child) => (
            <SidebarLink key={child.href} item={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function Sidebar({ items, className = '' }: SidebarProps): ReactNode {
  return (
    <nav
      className={`w-64 shrink-0 ${className}`}
      aria-label="사이드바 내비게이션"
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarLink key={item.href} item={item} />
        ))}
      </ul>
    </nav>
  )
}

export type { SidebarProps, SidebarItem }
