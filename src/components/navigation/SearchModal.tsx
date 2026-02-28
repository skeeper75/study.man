'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { Search, X, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'
import type { SearchResult } from '@/lib/search'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const difficultyVariant: Record<string, BadgeVariant> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

const difficultyLabel: Record<string, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
}

export function SearchModal({ open, onClose }: SearchModalProps): ReactNode {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (open) {
          onClose()
        }
      }
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery)
    setSelectedIndex(0)

    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { search } = await import('@/lib/search')
      const searchResults = await search(searchQuery)
      setResults(searchResults)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        window.location.href = results[selectedIndex].href
        onClose()
      }
    },
    [results, selectedIndex, onClose],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-modal flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="사이트 검색"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800">
          <Search size={18} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
            placeholder="문서 검색..."
            aria-label="검색어 입력"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label="검색 닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {loading && (
            <div className="py-6 text-center text-sm text-neutral-500">
              검색 중...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-6 text-center text-sm text-neutral-500">
              &quot;{query}&quot;에 대한 결과가 없습니다
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul role="listbox" aria-label="검색 결과">
              {results.map((result, index) => (
                <li
                  key={result.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <a
                    href={result.href}
                    className={`flex items-start gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-50 dark:bg-primary-950'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                    onClick={() => onClose()}
                  >
                    <FileText
                      size={16}
                      className="mt-0.5 shrink-0 text-neutral-400"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {result.title}
                        </span>
                        <Badge variant={difficultyVariant[result.difficulty]}>
                          {difficultyLabel[result.difficulty]}
                        </Badge>
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                        {result.breadcrumb}
                      </div>
                      {result.preview && (
                        <div className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {result.preview}
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="py-6 text-center text-xs text-neutral-400">
              검색어를 입력하세요
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-neutral-200 px-4 py-2 text-xs text-neutral-400 dark:border-neutral-800">
          <span>
            <kbd className="rounded border border-neutral-200 px-1 dark:border-neutral-700">
              &uarr;
            </kbd>
            <kbd className="ml-1 rounded border border-neutral-200 px-1 dark:border-neutral-700">
              &darr;
            </kbd>{' '}
            이동
          </span>
          <span>
            <kbd className="rounded border border-neutral-200 px-1.5 dark:border-neutral-700">
              Enter
            </kbd>{' '}
            열기
          </span>
          <span>
            <kbd className="rounded border border-neutral-200 px-1.5 dark:border-neutral-700">
              Esc
            </kbd>{' '}
            닫기
          </span>
        </div>
      </div>
    </div>
  )
}

export type { SearchModalProps }
