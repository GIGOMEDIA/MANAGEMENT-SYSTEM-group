export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  // Products / Inventory
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
  },
  // Sales
  SALES: {
    BASE: '/sales',
    BY_ID: (id: string) => `/sales/${id}`,
    STATS: '/sales/stats',
  },
  // Suppliers
  SUPPLIERS: {
    BASE: '/suppliers',
    BY_ID: (id: string) => `/suppliers/${id}`,
  },
  // Reports
  REPORTS: {
    REVENUE: '/reports/revenue',
    PRODUCTS: '/reports/products',
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_TRANSACTIONS: '/dashboard/recent-transactions',
    LOW_STOCK: '/dashboard/low-stock',
  },
} as const
