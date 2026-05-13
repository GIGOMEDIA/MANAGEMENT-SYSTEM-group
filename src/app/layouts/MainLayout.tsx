import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useSidebarStore } from '@/app/store/sidebarStore'
import { cn } from '@/shared/utils'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

export function MainLayout() {
  const { isOpen, isCollapsed } = useSidebarStore()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => useSidebarStore.getState().close()}
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300',
          'lg:ml-0',
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
