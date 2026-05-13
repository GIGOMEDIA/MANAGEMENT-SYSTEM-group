// ─── Pagination ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── API ────────────────────────────────────────────────────────────────────
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ─── Product / Inventory ────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  description?: string
  productCount: number
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  categoryId: string
  price: number
  costPrice: number
  quantity: number
  lowStockThreshold: number
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─── Sales ──────────────────────────────────────────────────────────────────
export interface SaleItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  invoiceNumber: string
  customerId?: string
  customerName: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'transfer'
  status: 'completed' | 'pending' | 'cancelled' | 'refunded'
  notes?: string
  createdAt: string
  updatedAt: string
}

// ─── Suppliers ──────────────────────────────────────────────────────────────
export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  taxId?: string
  paymentTerms?: string
  isActive: boolean
  totalPurchases: number
  createdAt: string
  updatedAt: string
}

// ─── Users ──────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  avatar?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalProducts: number
  lowStockCount: number
  totalCustomers: number
  customersGrowth: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  expenses: number
  profit: number
}
