'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { Copy, Check, Play } from 'lucide-react'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  showPlayground?: boolean
}

export function CodeBlock({
  children,
  language = 'sql',
  filename,
  showLineNumbers = false,
  showPlayground = false,
}: CodeBlockProps): ReactNode {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }, [children])

  const lines = children.trimEnd().split('\n')

  return (
    <div className="group relative my-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
      {filename && (
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 rounded-t-lg">
          <span>{filename}</span>
          <span className="ml-auto text-neutral-400 dark:text-neutral-600">
            {language}
          </span>
        </div>
      )}

      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed !bg-transparent !rounded-none">
          <code className={`language-${language}`}>
            {showLineNumbers
              ? lines.map((line, i) => (
                  <span key={i} className="table-row">
                    <span className="table-cell pr-4 text-right text-neutral-400 select-none dark:text-neutral-600">
                      {i + 1}
                    </span>
                    <span className="table-cell">{line}{'\n'}</span>
                  </span>
                ))
              : children}
          </code>
        </pre>

        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {showPlayground && (
            <a
              href={`/playground?sql=${encodeURIComponent(children)}`}
              className="rounded-md bg-neutral-100 p-1.5 text-neutral-500 hover:bg-primary-50 hover:text-primary-500 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-primary-950 dark:hover:text-primary-400"
              title="플레이그라운드에서 실행"
              aria-label="플레이그라운드에서 실행"
            >
              <Play size={14} />
            </a>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md bg-neutral-100 p-1.5 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            aria-label={copied ? '복사됨' : '코드 복사'}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export type { CodeBlockProps }
