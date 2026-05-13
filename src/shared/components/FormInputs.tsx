import { Search } from 'lucide-react'
import { cn } from '@/shared/utils'
import type { InputHTMLAttributes } from 'react'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        {...props}
        className={cn(
          'pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
          'rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          'w-full',
          className,
        )}
      />
    </div>
  )
}

interface SelectInputProps extends InputHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  containerClassName?: string
}

export function SelectInput({ options, containerClassName, className, ...props }: SelectInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <select
        {...(props as object)}
        className={cn(
          'px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
          'rounded-xl text-sm text-slate-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
          'appearance-none pr-8 cursor-pointer',
          className,
        )}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function FormInput({ label, error, hint, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...props}
        className={cn(
          'w-full px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm transition-all',
          'text-slate-900 dark:text-white placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error
            ? 'border-red-400 dark:border-red-500'
            : 'border-slate-200 dark:border-slate-700',
          className,
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
