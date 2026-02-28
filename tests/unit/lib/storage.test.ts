import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProgress,
  setProgress,
  getBookmarks,
  addBookmark,
  removeBookmark,
  getNotes,
  setNote,
  deleteNote,
  clearAllData,
  getStorageUsage,
  type Bookmark,
  type Note,
} from '@/lib/storage'

describe('Storage Library', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('progress tracking', () => {
    it('should return empty progress by default', () => {
      const progress = getProgress()
      expect(progress).toEqual({})
    })

    it('should set and get progress data', () => {
      const data = {
        'getting-started/introduction': { completed: true, lastVisited: '2026-02-28' },
      }
      setProgress(data)
      const result = getProgress()
      expect(result['getting-started/introduction'].completed).toBe(true)
    })

    it('should persist progress across calls', () => {
      setProgress({
        'basics/select': { completed: true, lastVisited: '2026-02-28' },
        'basics/filtering': { completed: true, lastVisited: '2026-02-28' },
      })
      const result = getProgress()
      expect(Object.keys(result)).toHaveLength(2)
      expect(result['basics/select'].completed).toBe(true)
      expect(result['basics/filtering'].completed).toBe(true)
    })

    it('should overwrite previous progress data', () => {
      setProgress({ 'basics/select': { completed: true, lastVisited: '2026-02-28' } })
      setProgress({ 'basics/filtering': { completed: true, lastVisited: '2026-02-28' } })
      const result = getProgress()
      expect(result['basics/select']).toBeUndefined()
      expect(result['basics/filtering'].completed).toBe(true)
    })
  })

  describe('bookmarks', () => {
    it('should return empty bookmarks by default', () => {
      expect(getBookmarks()).toEqual([])
    })

    it('should add a bookmark', () => {
      const bookmark: Bookmark = { id: 'basics/select', title: 'SELECT Basics', addedAt: '2026-02-28' }
      addBookmark(bookmark)
      const bookmarks = getBookmarks()
      expect(bookmarks).toHaveLength(1)
      expect(bookmarks[0].id).toBe('basics/select')
    })

    it('should not add duplicate bookmarks', () => {
      const bookmark: Bookmark = { id: 'basics/select', title: 'SELECT Basics', addedAt: '2026-02-28' }
      addBookmark(bookmark)
      addBookmark(bookmark)
      expect(getBookmarks()).toHaveLength(1)
    })

    it('should add multiple distinct bookmarks', () => {
      addBookmark({ id: 'basics/select', title: 'SELECT', addedAt: '2026-02-28' })
      addBookmark({ id: 'intermediate/joins', title: 'JOINs', addedAt: '2026-02-28' })
      expect(getBookmarks()).toHaveLength(2)
    })

    it('should remove a bookmark by id', () => {
      addBookmark({ id: 'basics/select', title: 'SELECT', addedAt: '2026-02-28' })
      addBookmark({ id: 'intermediate/joins', title: 'JOINs', addedAt: '2026-02-28' })
      removeBookmark('basics/select')
      const bookmarks = getBookmarks()
      expect(bookmarks).toHaveLength(1)
      expect(bookmarks[0].id).toBe('intermediate/joins')
    })

    it('should handle removing non-existent bookmark gracefully', () => {
      removeBookmark('nonexistent')
      expect(getBookmarks()).toEqual([])
    })
  })

  describe('notes', () => {
    it('should return empty notes by default', () => {
      expect(getNotes()).toEqual({})
    })

    it('should set a note for a page', () => {
      const note: Note = { content: 'Remember: SELECT * is bad practice', updatedAt: '2026-02-28' }
      setNote('basics/select', note)
      const notes = getNotes()
      expect(notes['basics/select'].content).toBe('Remember: SELECT * is bad practice')
    })

    it('should update an existing note', () => {
      setNote('basics/select', { content: 'old note', updatedAt: '2026-02-27' })
      setNote('basics/select', { content: 'updated note', updatedAt: '2026-02-28' })
      const notes = getNotes()
      expect(notes['basics/select'].content).toBe('updated note')
    })

    it('should delete a note', () => {
      setNote('basics/select', { content: 'test', updatedAt: '2026-02-28' })
      deleteNote('basics/select')
      const notes = getNotes()
      expect(notes['basics/select']).toBeUndefined()
    })

    it('should handle deleting non-existent note gracefully', () => {
      deleteNote('nonexistent')
      expect(getNotes()).toEqual({})
    })

    it('should preserve other notes when deleting one', () => {
      setNote('basics/select', { content: 'note 1', updatedAt: '2026-02-28' })
      setNote('basics/filtering', { content: 'note 2', updatedAt: '2026-02-28' })
      deleteNote('basics/select')
      const notes = getNotes()
      expect(notes['basics/select']).toBeUndefined()
      expect(notes['basics/filtering'].content).toBe('note 2')
    })
  })

  describe('clearAllData', () => {
    it('should clear all progress, bookmarks, and notes', () => {
      setProgress({ 'basics/select': { completed: true, lastVisited: '2026-02-28' } })
      addBookmark({ id: 'basics/select', title: 'SELECT', addedAt: '2026-02-28' })
      setNote('basics/select', { content: 'note', updatedAt: '2026-02-28' })
      clearAllData()
      expect(getProgress()).toEqual({})
      expect(getBookmarks()).toEqual([])
      expect(getNotes()).toEqual({})
    })
  })

  describe('getStorageUsage', () => {
    it('should return zero usage when empty', () => {
      const usage = getStorageUsage()
      expect(usage.usedBytes).toBe(0)
      expect(usage.maxBytes).toBe(5 * 1024 * 1024)
      expect(usage.percentage).toBe(0)
    })

    it('should return non-zero usage after storing data', () => {
      setProgress({ 'basics/select': { completed: true, lastVisited: '2026-02-28' } })
      const usage = getStorageUsage()
      expect(usage.usedBytes).toBeGreaterThan(0)
      expect(usage.percentage).toBeGreaterThan(0)
    })
  })

  describe('error handling', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('pgstudy:progress', 'not-valid-json{{{')
      const progress = getProgress()
      expect(progress).toEqual({})
    })

    it('should handle corrupted bookmarks data gracefully', () => {
      localStorage.setItem('pgstudy:bookmarks', 'invalid')
      const bookmarks = getBookmarks()
      expect(bookmarks).toEqual([])
    })

    it('should handle corrupted notes data gracefully', () => {
      localStorage.setItem('pgstudy:notes', '{{broken}')
      const notes = getNotes()
      expect(notes).toEqual({})
    })
  })
})
