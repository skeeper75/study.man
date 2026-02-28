'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Search, Menu, X } from 'lucide-react'
import { useState, useCallback, type ReactNode } from 'react'

interface HeaderProps {
  onSearchOpen?: () => void
}

export function Header({ onSearchOpen }: HeaderProps): ReactNode {
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  return (
    <header className="sticky top-0 z-sticky border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 lg:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
            <span className="text-primary-500">PG</span>
            <span>Study</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-500 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
            onClick={onSearchOpen}
            aria-label="검색"
          >
            <Search size={16} />
            <span className="hidden sm:inline">검색...</span>
            <kbd className="hidden rounded border border-neutral-200 px-1.5 py-0.5 text-xs text-neutral-400 dark:border-neutral-700 sm:inline">
              Ctrl+K
            </kbd>
          </button>

          <button
            type="button"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export type { HeaderProps }
