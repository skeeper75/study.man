'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { CheckCircle2, Circle, BookOpen } from 'lucide-react'

interface SectionProgress {
  section: string
  label: string
  total: number
  completed: number
}

const STORAGE_KEY = 'pgstudy-progress'

function getProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

export function ProgressDashboard(): ReactNode {
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setProgress(getProgress())

    const handleStorage = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        setProgress(getProgress())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const sections: SectionProgress[] = [
    { section: 'getting-started', label: '시작하기', total: 3, completed: 0 },
    { section: 'basics', label: 'SQL 기초', total: 4, completed: 0 },
    { section: 'data-modeling', label: '데이터 모델링', total: 3, completed: 0 },
    { section: 'intermediate', label: '중급', total: 4, completed: 0 },
    { section: 'advanced', label: '고급', total: 5, completed: 0 },
    { section: 'practical', label: '실전', total: 3, completed: 0 },
    { section: 'reference', label: '레퍼런스', total: 3, completed: 0 },
  ]

  for (const section of sections) {
    for (const [key, value] of Object.entries(progress)) {
      if (key.startsWith(section.section + '/') && value) {
        section.completed++
      }
    }
  }

  const totalCompleted = sections.reduce((sum, s) => sum + s.completed, 0)
  const totalLessons = sections.reduce((sum, s) => sum + s.total, 0)
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
      <div className="mb-6 flex items-center gap-3">
        <BookOpen size={20} className="text-primary-500" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          학습 진행률
        </h3>
        <span className="ml-auto text-2xl font-bold text-primary-500">
          {overallPercent}%
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const percent =
            section.total > 0
              ? Math.round((section.completed / section.total) * 100)
              : 0
          const isComplete = section.completed === section.total

          return (
            <div key={section.section} className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 size={16} className="shrink-0 text-success-500" />
              ) : (
                <Circle size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
              )}
              <span className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">
                {section.label}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {section.completed}/{section.total}
              </span>
              <div className="w-16 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-success-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
