'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { StickyNote, Save, Trash2 } from 'lucide-react'

interface NoteEditorProps {
  pageId: string
}

const STORAGE_KEY = 'pgstudy-notes'

function getNotes(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function saveNotes(notes: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function NoteEditor({ pageId }: NoteEditorProps): ReactNode {
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const notes = getNotes()
    const existingNote = notes[pageId] ?? ''
    setNote(existingNote)
    if (existingNote) setExpanded(true)
  }, [pageId])

  const handleSave = useCallback(() => {
    const notes = getNotes()
    if (note.trim()) {
      notes[pageId] = note.trim()
    } else {
      delete notes[pageId]
    }
    saveNotes(notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [note, pageId])

  const handleDelete = useCallback(() => {
    const notes = getNotes()
    delete notes[pageId]
    saveNotes(notes)
    setNote('')
    setExpanded(false)
  }, [pageId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    },
    [handleSave],
  )

  return (
    <div className="mt-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => {
          setExpanded((prev) => !prev)
          if (!expanded) {
            requestAnimationFrame(() => textareaRef.current?.focus())
          }
        }}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900 rounded-lg transition-colors"
        aria-expanded={expanded}
      >
        <StickyNote size={16} />
        <span>{note ? '내 메모' : '메모 작성'}</span>
        {note && !expanded && (
          <span className="ml-2 truncate text-xs text-neutral-400 dark:text-neutral-500">
            {note.slice(0, 50)}
            {note.length > 50 ? '...' : ''}
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[80px] rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 resize-y"
            placeholder="이 페이지에 대한 메모를 작성하세요..."
            aria-label="메모"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600 transition-colors"
            >
              <Save size={12} />
              {saved ? '저장됨' : '저장'}
              <kbd className="ml-1 opacity-70">Ctrl+S</kbd>
            </button>
            {note && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-neutral-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-700/10 dark:hover:text-error-500 transition-colors"
              >
                <Trash2 size={12} />
                삭제
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export type { NoteEditorProps }
