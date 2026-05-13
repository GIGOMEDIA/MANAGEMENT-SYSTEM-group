import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { InventoryPage } from '@/features/inventory/pages/InventoryPage'
import { SalesPage } from '@/features/sales/pages/SalesPage'
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { NotFoundPage } from '@/shared/components/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
