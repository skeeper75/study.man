import { Badge } from '@/components/ui/Badge'
import type { ReactNode } from 'react'

interface VersionBadgeProps {
  version: number
  className?: string
}

export function VersionBadge({ version, className = '' }: VersionBadgeProps): ReactNode {
  return (
    <Badge variant="version" className={className}>
      PG {version}+
    </Badge>
  )
}

export type { VersionBadgeProps }
