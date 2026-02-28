import type { ReactNode } from 'react'

export function Footer(): ReactNode {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {currentYear} PGStudy. PostgreSQL 학습 가이드.
          </div>
          <div className="flex gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <a
              href="https://www.postgresql.org/docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              PostgreSQL 공식 문서
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
