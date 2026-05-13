import { cn } from '@/shared/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  change?: number
  icon: ReactNode
  iconBg?: string
}

export function StatCard({ title, value, change, icon, iconBg = 'bg-blue-500' }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {change !== undefined && (
            <p className={cn('text-xs font-medium mt-2 flex items-center gap-1', isPositive ? 'text-emerald-600' : 'text-red-500')}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(change)}% vs last month</span>
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
