'use client'

import {
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { Play, Loader2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  duration: number
}

interface QueryError {
  message: string
  code?: string
}

interface SQLPlaygroundProps {
  defaultQuery?: string
  title?: string
}

function ResultsTable({ result }: { result: QueryResult }): ReactNode {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {result.columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-medium text-neutral-600 dark:text-neutral-400"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-neutral-100 dark:border-neutral-800"
            >
              {result.columns.map((col) => (
                <td
                  key={col}
                  className="px-3 py-1.5 text-neutral-800 dark:text-neutral-200"
                >
                  {row[col] === null ? (
                    <span className="italic text-neutral-400">NULL</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        {result.rowCount}개 행 ({result.duration}ms)
      </div>
    </div>
  )
}

export function SQLPlayground({
  defaultQuery = 'SELECT 1 AS result;',
  title,
}: SQLPlaygroundProps): ReactNode {
  const [query, setQuery] = useState(defaultQuery)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<QueryError | null>(null)
  const [loading, setLoading] = useState(false)
  const [explain, setExplain] = useState(false)
  const [activated, setActivated] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleRun = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Dynamic import of pglite worker interface
      const { queryPGlite } = await import('@/lib/pglite-worker')
      const finalQuery = explain
        ? `EXPLAIN ANALYZE ${query}`
        : query

      const startTime = performance.now()
      const res = await queryPGlite(finalQuery)
      const duration = Math.round(performance.now() - startTime)

      setResult({
        columns: res.fields.map((f: { name: string }) => f.name),
        rows: res.rows as Record<string, unknown>[],
        rowCount: res.rows.length,
        duration,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      const code = message.match(/ERROR\s+(\w+)/)?.[1]
      setError({ message, code })
    } finally {
      setLoading(false)
    }
  }, [query, explain])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    },
    [handleRun],
  )

  if (!activated) {
    return (
      <div className="my-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setActivated(true)}
          className="flex w-full items-center justify-center gap-2 px-4 py-6 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-primary-500 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-primary-400 rounded-lg transition-colors"
        >
          <Play size={16} />
          SQL 플레이그라운드 활성화
        </button>
      </div>
    )
  }

  return (
    <div className="my-4 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {title && (
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          {title}
        </div>
      )}

      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[100px] rounded-md border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-600 resize-y"
          placeholder="SQL 쿼리를 입력하세요..."
          spellCheck={false}
          aria-label="SQL 쿼리 입력"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRun}
              disabled={loading || !query.trim()}
              size="sm"
            >
              {loading ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : (
                <Play size={14} className="mr-1.5" />
              )}
              실행
              <kbd className="ml-2 text-xs opacity-70">Ctrl+Enter</kbd>
            </Button>

            <button
              type="button"
              onClick={() => setExplain((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              aria-pressed={explain}
            >
              {explain ? (
                <ToggleRight size={18} className="text-primary-500" />
              ) : (
                <ToggleLeft size={18} />
              )}
              EXPLAIN ANALYZE
            </button>
          </div>
        </div>
      </div>

      {(result ?? error) && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-error-50 p-3 text-sm text-error-700 dark:bg-error-700/10 dark:text-error-500">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <span className="font-medium">
                  {error.code ? `ERROR ${error.code}` : 'Error'}
                </span>
                <p className="mt-1">{error.message}</p>
                {error.code && (
                  <a
                    href={`/reference/errors#${error.code.toLowerCase()}`}
                    className="mt-1 inline-block text-xs underline hover:no-underline"
                  >
                    오류 코드 레퍼런스 보기
                  </a>
                )}
              </div>
            </div>
          )}

          {result && <ResultsTable result={result} />}
        </div>
      )}
    </div>
  )
}

export type { SQLPlaygroundProps, QueryResult, QueryError }
