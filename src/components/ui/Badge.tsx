import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'beginner' | 'intermediate' | 'advanced' | 'version'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  beginner:
    'bg-success-50 text-success-700 dark:bg-success-700/20 dark:text-success-500',
  intermediate:
    'bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-500',
  advanced:
    'bg-error-50 text-error-700 dark:bg-error-700/20 dark:text-error-500',
  version:
    'bg-info-50 text-info-700 dark:bg-info-700/20 dark:text-info-500',
}

export function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps): ReactNode {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export type { BadgeProps, BadgeVariant }
