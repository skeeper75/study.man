'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  pageId: string
}

const STORAGE_KEY = 'pgstudy-bookmarks'

function getBookmarks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function setBookmarks(bookmarks: Record<string, boolean>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

export function BookmarkButton({ pageId }: BookmarkButtonProps): ReactNode {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = getBookmarks()
    setBookmarked(Boolean(bookmarks[pageId]))
  }, [pageId])

  const toggleBookmark = useCallback(() => {
    const bookmarks = getBookmarks()
    if (bookmarks[pageId]) {
      delete bookmarks[pageId]
      setBookmarked(false)
    } else {
      bookmarks[pageId] = true
      setBookmarked(true)
    }
    setBookmarks(bookmarks)
  }, [pageId])

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
        bookmarked
          ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
          : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
      }`}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? '북마크 제거' : '북마크 추가'}
    >
      <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
      {bookmarked ? '북마크됨' : '북마크'}
    </button>
  )
}

export type { BookmarkButtonProps }
