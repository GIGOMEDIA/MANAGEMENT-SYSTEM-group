import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useSidebarStore } from '@/app/store/sidebarStore'
import { useThemeStore } from '@/app/store/themeStore'
import { useAuthStore } from '@/app/store/authStore'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory Management',
  '/sales': 'Sales & Orders',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports & Analytics',
  '/users': 'User Management',
}

export function Topbar() {
  const { toggle } = useSidebarStore()
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard'

  return (
    <header className="h-16 flex items-center gap-4 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      {/* Hamburger */}
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{pageTitle}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 ml-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
