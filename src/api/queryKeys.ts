export const queryKeys = {
  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    recentTransactions: () => [...queryKeys.dashboard.all, 'recent-transactions'] as const,
    lowStock: () => [...queryKeys.dashboard.all, 'low-stock'] as const,
  },
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    categories: () => [...queryKeys.products.all, 'categories'] as const,
  },
  // Sales
  sales: {
    all: ['sales'] as const,
    lists: () => [...queryKeys.sales.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.sales.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.sales.all, 'detail', id] as const,
    stats: () => [...queryKeys.sales.all, 'stats'] as const,
  },
  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.suppliers.all, 'detail', id] as const,
  },
  // Reports
  reports: {
    all: ['reports'] as const,
    revenue: (range: string) => [...queryKeys.reports.all, 'revenue', range] as const,
    products: () => [...queryKeys.reports.all, 'products'] as const,
  },
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
}
