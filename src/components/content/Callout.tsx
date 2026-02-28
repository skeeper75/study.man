import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

type CalloutType = 'info' | 'warning' | 'tip' | 'error'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const config: Record<
  CalloutType,
  { icon: typeof Info; bgClass: string; borderClass: string; iconClass: string; titleClass: string }
> = {
  info: {
    icon: Info,
    bgClass: 'bg-info-50 dark:bg-info-700/10',
    borderClass: 'border-info-500',
    iconClass: 'text-info-500',
    titleClass: 'text-info-700 dark:text-info-500',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-warning-50 dark:bg-warning-700/10',
    borderClass: 'border-warning-500',
    iconClass: 'text-warning-500',
    titleClass: 'text-warning-700 dark:text-warning-500',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-success-50 dark:bg-success-700/10',
    borderClass: 'border-success-500',
    iconClass: 'text-success-500',
    titleClass: 'text-success-700 dark:text-success-500',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-error-50 dark:bg-error-700/10',
    borderClass: 'border-error-500',
    iconClass: 'text-error-500',
    titleClass: 'text-error-700 dark:text-error-500',
  },
}

const defaultTitles: Record<CalloutType, string> = {
  info: '참고',
  warning: '주의',
  tip: '팁',
  error: '오류',
}

export function Callout({
  type = 'info',
  title,
  children,
}: CalloutProps): ReactNode {
  const { icon: Icon, bgClass, borderClass, iconClass, titleClass } = config[type]
  const displayTitle = title ?? defaultTitles[type]

  return (
    <div
      className={`my-4 rounded-lg border-l-4 p-4 ${bgClass} ${borderClass}`}
      role="note"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className={iconClass} aria-hidden="true" />
        <span className={`text-sm font-semibold ${titleClass}`}>
          {displayTitle}
        </span>
      </div>
      <div className="text-sm text-neutral-700 dark:text-neutral-300 [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export type { CalloutProps, CalloutType }
