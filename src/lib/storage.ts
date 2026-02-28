const STORAGE_PREFIX = 'pgstudy:';
const MAX_STORAGE_BYTES = 5 * 1024 * 1024;

export interface ProgressEntry {
  completed: boolean;
  lastVisited: string;
}

export type Progress = Record<string, ProgressEntry>;

export interface Bookmark {
  id: string;
  title: string;
  addedAt: string;
}

export interface Note {
  content: string;
  updatedAt: string;
}

type Notes = Record<string, Note>;

function getKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(getKey(key), JSON.stringify(value));
}

export function getProgress(): Progress {
  return readJSON<Progress>('progress', {});
}

export function setProgress(data: Progress): void {
  writeJSON('progress', data);
}

export function getBookmarks(): Bookmark[] {
  return readJSON<Bookmark[]>('bookmarks', []);
}

export function addBookmark(bookmark: Bookmark): void {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.id === bookmark.id)) return;
  bookmarks.push(bookmark);
  writeJSON('bookmarks', bookmarks);
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  writeJSON('bookmarks', bookmarks);
}

export function getNotes(): Notes {
  return readJSON<Notes>('notes', {});
}

export function setNote(pageId: string, note: Note): void {
  const notes = getNotes();
  notes[pageId] = note;
  writeJSON('notes', notes);
}

export function deleteNote(pageId: string): void {
  const notes = getNotes();
  delete notes[pageId];
  writeJSON('notes', notes);
}

export function clearAllData(): void {
  localStorage.removeItem(getKey('progress'));
  localStorage.removeItem(getKey('bookmarks'));
  localStorage.removeItem(getKey('notes'));
}

export function getStorageUsage(): { usedBytes: number; maxBytes: number; percentage: number } {
  let usedBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        usedBytes += key.length * 2 + value.length * 2;
      }
    }
  }

  return {
    usedBytes,
    maxBytes: MAX_STORAGE_BYTES,
    percentage: (usedBytes / MAX_STORAGE_BYTES) * 100,
  };
}
