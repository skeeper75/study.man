import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  type Progress,
  type Bookmark,
  type Note,
} from '../storage';

// Mock localStorage
const store = new Map<string, string>();
const mockLocalStorage = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => store.set(key, value)),
  removeItem: vi.fn((key: string) => store.delete(key)),
  clear: vi.fn(() => store.clear()),
  get length() {
    return store.size;
  },
  key: vi.fn((index: number) => {
    const keys = Array.from(store.keys());
    return keys[index] ?? null;
  }),
};

vi.stubGlobal('localStorage', mockLocalStorage);

describe('Storage Library', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  describe('Progress', () => {
    it('should return empty progress when none exists', () => {
      const progress = getProgress();
      expect(progress).toEqual({});
    });

    it('should set and get progress', () => {
      const data: Progress = {
        'getting-started': { completed: true, lastVisited: '2024-01-01' },
      };
      setProgress(data);
      expect(getProgress()).toEqual(data);
    });

    it('should overwrite previous progress', () => {
      setProgress({ 'page-1': { completed: true, lastVisited: '2024-01-01' } });
      setProgress({ 'page-2': { completed: false, lastVisited: '2024-01-02' } });
      const result = getProgress();
      expect(result['page-1']).toBeUndefined();
      expect(result['page-2']).toBeDefined();
    });
  });

  describe('Bookmarks', () => {
    it('should return empty array when no bookmarks', () => {
      expect(getBookmarks()).toEqual([]);
    });

    it('should add a bookmark', () => {
      const bookmark: Bookmark = {
        id: 'joins',
        title: 'SQL Joins',
        addedAt: '2024-01-01',
      };
      addBookmark(bookmark);
      expect(getBookmarks()).toEqual([bookmark]);
    });

    it('should not add duplicate bookmarks', () => {
      const bookmark: Bookmark = {
        id: 'joins',
        title: 'SQL Joins',
        addedAt: '2024-01-01',
      };
      addBookmark(bookmark);
      addBookmark(bookmark);
      expect(getBookmarks()).toHaveLength(1);
    });

    it('should remove a bookmark', () => {
      const bookmark: Bookmark = {
        id: 'joins',
        title: 'SQL Joins',
        addedAt: '2024-01-01',
      };
      addBookmark(bookmark);
      removeBookmark('joins');
      expect(getBookmarks()).toEqual([]);
    });
  });

  describe('Notes', () => {
    it('should return empty object when no notes', () => {
      expect(getNotes()).toEqual({});
    });

    it('should set and get a note', () => {
      const note: Note = {
        content: 'Remember to use indexes on foreign keys',
        updatedAt: '2024-01-01',
      };
      setNote('joins', note);
      const notes = getNotes();
      expect(notes['joins']).toEqual(note);
    });

    it('should delete a note', () => {
      const note: Note = {
        content: 'Test note',
        updatedAt: '2024-01-01',
      };
      setNote('page-1', note);
      deleteNote('page-1');
      expect(getNotes()['page-1']).toBeUndefined();
    });
  });

  describe('clearAllData', () => {
    it('should clear all stored data', () => {
      setProgress({ 'page-1': { completed: true, lastVisited: '2024-01-01' } });
      addBookmark({ id: 'joins', title: 'Joins', addedAt: '2024-01-01' });
      setNote('page-1', { content: 'Note', updatedAt: '2024-01-01' });

      clearAllData();

      expect(getProgress()).toEqual({});
      expect(getBookmarks()).toEqual([]);
      expect(getNotes()).toEqual({});
    });
  });

  describe('getStorageUsage', () => {
    it('should return storage usage info', () => {
      setProgress({ 'page-1': { completed: true, lastVisited: '2024-01-01' } });
      const usage = getStorageUsage();
      expect(usage.usedBytes).toBeGreaterThan(0);
      expect(usage.maxBytes).toBe(5 * 1024 * 1024);
      expect(usage.percentage).toBeGreaterThan(0);
      expect(usage.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('error handling', () => {
    it('should handle corrupted data gracefully', () => {
      store.set('pgstudy:progress', 'invalid json{{{');
      expect(getProgress()).toEqual({});
    });
  });
});
