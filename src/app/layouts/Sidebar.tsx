import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Truck, BarChart3,
  Users, Settings, LogOut, ChevronLeft, Store, X,
} from 'lucide-react'
import { useSidebarStore } from '@/app/store/sidebarStore'
import { useAuthStore } from '@/app/store/authStore'
import { cn } from '@/shared/utils'
import { toast } from 'sonner'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users },
]

export function Sidebar() {
  const { isOpen, isCollapsed, toggleCollapse, close } = useSidebarStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col',
          'bg-slate-900 dark:bg-slate-950',
          'transition-all duration-300 ease-in-out',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible
          'lg:translate-x-0 lg:static lg:z-auto',
          isCollapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 px-4 h-16 border-b border-slate-800',
          isCollapsed && 'justify-center px-2',
        )}>
          <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Store className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-white font-bold text-base leading-none">StoreMS</p>
              <p className="text-slate-400 text-xs mt-0.5">Enterprise</p>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={close}
            className="ml-auto text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800',
                )
              }
              title={isCollapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User profile + collapse toggle */}
        <div className="border-t border-slate-800 p-3 space-y-2">
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-slate-400 text-xs capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium',
              'text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all',
              isCollapsed && 'justify-center',
            )}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleCollapse}
            className={cn(
              'hidden lg:flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium',
              'text-slate-400 hover:text-white hover:bg-slate-800 transition-all',
              isCollapsed && 'justify-center',
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
