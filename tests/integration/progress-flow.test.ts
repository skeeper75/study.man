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
  type ProgressEntry,
  type Bookmark,
  type Note,
} from '@/lib/storage'

describe('Progress Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('complete lesson -> progress update -> dashboard', () => {
    it('should update section progress when a lesson is marked complete', () => {
      // FR-007: persist completion status
      const progress = getProgress()
      expect(progress).toEqual({})

      const updated: Record<string, ProgressEntry> = {
        'basics/select': { completed: true, lastVisited: new Date().toISOString() },
        'basics/filtering': { completed: true, lastVisited: new Date().toISOString() },
        'basics/joins': { completed: true, lastVisited: new Date().toISOString() },
      }
      setProgress(updated)

      const stored = getProgress()
      expect(Object.keys(stored)).toHaveLength(3)
      expect(stored['basics/select'].completed).toBe(true)
      expect(stored['basics/filtering'].completed).toBe(true)
      expect(stored['basics/joins'].completed).toBe(true)
    })

    it('should reflect completion in the progress dashboard data', () => {
      // FR-007: progress dashboard
      setProgress({
        'getting-started/introduction': { completed: true, lastVisited: new Date().toISOString() },
        'getting-started/first-query': { completed: true, lastVisited: new Date().toISOString() },
      })

      const progress = getProgress()
      const completedCount = Object.values(progress).filter((p) => p.completed).length
      expect(completedCount).toBe(2)
    })

    it('should persist progress across sessions', () => {
      // FR-007: localStorage persistence
      setProgress({
        'basics/select': { completed: true, lastVisited: '2024-01-01T00:00:00.000Z' },
      })

      // Simulate "new session" by reading from localStorage again
      const progress = getProgress()
      expect(progress['basics/select'].completed).toBe(true)
      expect(progress['basics/select'].lastVisited).toBe('2024-01-01T00:00:00.000Z')
    })

    it('should handle bookmarking and progress independently', () => {
      // Bookmarks and progress are separate features
      setProgress({
        'basics/select': { completed: true, lastVisited: new Date().toISOString() },
      })

      const bookmark: Bookmark = {
        id: 'basics/select',
        title: 'SELECT Basics',
        addedAt: new Date().toISOString(),
      }
      addBookmark(bookmark)

      // Both should coexist
      const progress = getProgress()
      const bookmarks = getBookmarks()
      expect(progress['basics/select'].completed).toBe(true)
      expect(bookmarks).toHaveLength(1)
      expect(bookmarks[0].id).toBe('basics/select')

      // Removing bookmark should not affect progress
      removeBookmark('basics/select')
      expect(getBookmarks()).toHaveLength(0)
      expect(getProgress()['basics/select'].completed).toBe(true)
    })

    it('should handle notes alongside progress', () => {
      // Notes should not interfere with progress tracking
      setProgress({
        'basics/select': { completed: true, lastVisited: new Date().toISOString() },
      })

      const note: Note = {
        content: 'Remember: SELECT * is generally bad practice',
        updatedAt: new Date().toISOString(),
      }
      setNote('basics/select', note)

      // Both should coexist
      const progress = getProgress()
      const notes = getNotes()
      expect(progress['basics/select'].completed).toBe(true)
      expect(notes['basics/select'].content).toBe('Remember: SELECT * is generally bad practice')

      // Deleting note should not affect progress
      deleteNote('basics/select')
      expect(getNotes()['basics/select']).toBeUndefined()
      expect(getProgress()['basics/select'].completed).toBe(true)
    })

    it('should clear all data types at once', () => {
      setProgress({
        'basics/select': { completed: true, lastVisited: new Date().toISOString() },
      })
      addBookmark({ id: 'basics/select', title: 'SELECT', addedAt: new Date().toISOString() })
      setNote('basics/select', { content: 'test', updatedAt: new Date().toISOString() })

      clearAllData()

      expect(getProgress()).toEqual({})
      expect(getBookmarks()).toEqual([])
      expect(getNotes()).toEqual({})
    })
  })
})
