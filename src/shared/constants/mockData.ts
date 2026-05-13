import type { Product, Sale, Supplier, User, DashboardStats, RevenueDataPoint, Category } from '@/shared/types'

// ─── Categories ─────────────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 45 },
  { id: 'cat-2', name: 'Clothing', description: 'Apparel and fashion', productCount: 120 },
  { id: 'cat-3', name: 'Food & Beverage', description: 'Food items and drinks', productCount: 80 },
  { id: 'cat-4', name: 'Office Supplies', description: 'Office and stationery products', productCount: 60 },
  { id: 'cat-5', name: 'Hardware', description: 'Tools and hardware equipment', productCount: 35 },
]

// ─── Products ────────────────────────────────────────────────────────────────
export const mockProducts: Product[] = [
  { id: 'p-1', name: 'Wireless Headphones', sku: 'EL-001', category: 'Electronics', categoryId: 'cat-1', price: 89.99, costPrice: 45.00, quantity: 120, lowStockThreshold: 20, description: 'Premium noise-cancelling headphones', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-2', name: 'USB-C Hub 7-in-1', sku: 'EL-002', category: 'Electronics', categoryId: 'cat-1', price: 49.99, costPrice: 22.00, quantity: 8, lowStockThreshold: 15, description: 'Multi-port USB-C hub', isActive: true, createdAt: '2024-01-12T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-3', name: 'Mechanical Keyboard', sku: 'EL-003', category: 'Electronics', categoryId: 'cat-1', price: 129.99, costPrice: 65.00, quantity: 55, lowStockThreshold: 10, description: 'RGB mechanical gaming keyboard', isActive: true, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-4', name: 'Office Chair Pro', sku: 'OF-001', category: 'Office Supplies', categoryId: 'cat-4', price: 299.99, costPrice: 150.00, quantity: 5, lowStockThreshold: 8, description: 'Ergonomic office chair', isActive: true, createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-5', name: 'A4 Paper Ream 500 Sheets', sku: 'OF-002', category: 'Office Supplies', categoryId: 'cat-4', price: 12.99, costPrice: 6.00, quantity: 200, lowStockThreshold: 30, description: 'High-quality white A4 paper', isActive: true, createdAt: '2024-01-22T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-6', name: 'Premium Coffee Beans 1kg', sku: 'FB-001', category: 'Food & Beverage', categoryId: 'cat-3', price: 24.99, costPrice: 12.00, quantity: 3, lowStockThreshold: 10, description: 'Arabica blend coffee beans', isActive: true, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-7', name: 'Power Drill 18V', sku: 'HW-001', category: 'Hardware', categoryId: 'cat-5', price: 159.99, costPrice: 80.00, quantity: 30, lowStockThreshold: 5, description: 'Cordless power drill', isActive: true, createdAt: '2024-02-05T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-8', name: 'Men\'s Casual Shirt', sku: 'CL-001', category: 'Clothing', categoryId: 'cat-2', price: 39.99, costPrice: 18.00, quantity: 180, lowStockThreshold: 25, description: 'Cotton casual shirt', isActive: true, createdAt: '2024-02-10T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-9', name: 'Laptop Stand Adjustable', sku: 'EL-004', category: 'Electronics', categoryId: 'cat-1', price: 59.99, costPrice: 28.00, quantity: 45, lowStockThreshold: 10, description: 'Aluminum laptop stand', isActive: true, createdAt: '2024-02-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  { id: 'p-10', name: 'Ball Point Pens (50pk)', sku: 'OF-003', category: 'Office Supplies', categoryId: 'cat-4', price: 8.99, costPrice: 3.50, quantity: 400, lowStockThreshold: 50, description: 'Blue ballpoint pens pack', isActive: true, createdAt: '2024-02-20T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z' },
]

// ─── Sales ──────────────────────────────────────────────────────────────────
export const mockSales: Sale[] = [
  { id: 's-1', invoiceNumber: 'INV-2024-0001', customerName: 'Acme Corp', items: [{ productId: 'p-1', productName: 'Wireless Headphones', sku: 'EL-001', quantity: 2, unitPrice: 89.99, totalPrice: 179.98 }, { productId: 'p-3', productName: 'Mechanical Keyboard', sku: 'EL-003', quantity: 1, unitPrice: 129.99, totalPrice: 129.99 }], subtotal: 309.97, tax: 27.90, discount: 0, total: 337.87, paymentMethod: 'card', status: 'completed', createdAt: '2024-03-15T09:00:00Z', updatedAt: '2024-03-15T09:00:00Z' },
  { id: 's-2', invoiceNumber: 'INV-2024-0002', customerName: 'Global Tech Ltd', items: [{ productId: 'p-2', productName: 'USB-C Hub', sku: 'EL-002', quantity: 5, unitPrice: 49.99, totalPrice: 249.95 }], subtotal: 249.95, tax: 22.50, discount: 25.00, total: 247.45, paymentMethod: 'transfer', status: 'completed', createdAt: '2024-03-14T14:00:00Z', updatedAt: '2024-03-14T14:00:00Z' },
  { id: 's-3', invoiceNumber: 'INV-2024-0003', customerName: 'StartUp Inc', items: [{ productId: 'p-4', productName: 'Office Chair Pro', sku: 'OF-001', quantity: 3, unitPrice: 299.99, totalPrice: 899.97 }], subtotal: 899.97, tax: 81.00, discount: 90.00, total: 890.97, paymentMethod: 'card', status: 'completed', createdAt: '2024-03-13T11:00:00Z', updatedAt: '2024-03-13T11:00:00Z' },
  { id: 's-4', invoiceNumber: 'INV-2024-0004', customerName: 'Local Cafe', items: [{ productId: 'p-6', productName: 'Premium Coffee Beans 1kg', sku: 'FB-001', quantity: 10, unitPrice: 24.99, totalPrice: 249.90 }], subtotal: 249.90, tax: 22.49, discount: 0, total: 272.39, paymentMethod: 'cash', status: 'completed', createdAt: '2024-03-12T16:00:00Z', updatedAt: '2024-03-12T16:00:00Z' },
  { id: 's-5', invoiceNumber: 'INV-2024-0005', customerName: 'HomePro Services', items: [{ productId: 'p-7', productName: 'Power Drill 18V', sku: 'HW-001', quantity: 2, unitPrice: 159.99, totalPrice: 319.98 }], subtotal: 319.98, tax: 28.80, discount: 0, total: 348.78, paymentMethod: 'card', status: 'pending', createdAt: '2024-03-11T10:00:00Z', updatedAt: '2024-03-11T10:00:00Z' },
  { id: 's-6', invoiceNumber: 'INV-2024-0006', customerName: 'Fashion House', items: [{ productId: 'p-8', productName: "Men's Casual Shirt", sku: 'CL-001', quantity: 20, unitPrice: 39.99, totalPrice: 799.80 }], subtotal: 799.80, tax: 72.00, discount: 80.00, total: 791.80, paymentMethod: 'transfer', status: 'completed', createdAt: '2024-03-10T09:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
]

// ─── Suppliers ───────────────────────────────────────────────────────────────
export const mockSuppliers: Supplier[] = [
  { id: 'sup-1', name: 'TechVision Distributors', contactPerson: 'James Wilson', email: 'james@techvision.com', phone: '+1-555-0101', address: '123 Tech Blvd', city: 'San Francisco', country: 'USA', taxId: 'US-123456', paymentTerms: 'Net 30', isActive: true, totalPurchases: 245000, createdAt: '2023-01-15T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z' },
  { id: 'sup-2', name: 'Global Office Supplies Co', contactPerson: 'Sarah Chen', email: 'sarah@globaloffice.com', phone: '+1-555-0202', address: '456 Commerce St', city: 'New York', country: 'USA', paymentTerms: 'Net 45', isActive: true, totalPurchases: 89000, createdAt: '2023-03-20T10:00:00Z', updatedAt: '2024-02-15T10:00:00Z' },
  { id: 'sup-3', name: 'FreshBrew Trading', contactPerson: 'Carlos Mendez', email: 'carlos@freshbrew.com', phone: '+1-555-0303', address: '789 Market Ave', city: 'Chicago', country: 'USA', paymentTerms: 'Net 15', isActive: true, totalPurchases: 56000, createdAt: '2023-05-10T10:00:00Z', updatedAt: '2024-01-30T10:00:00Z' },
  { id: 'sup-4', name: 'ProTools Hardware Inc', contactPerson: 'Emma Thompson', email: 'emma@protools.com', phone: '+1-555-0404', address: '321 Industrial Rd', city: 'Detroit', country: 'USA', paymentTerms: 'Net 30', isActive: true, totalPurchases: 134000, createdAt: '2023-07-01T10:00:00Z', updatedAt: '2024-03-10T10:00:00Z' },
  { id: 'sup-5', name: 'StyleForward Apparel', contactPerson: 'Ama Osei', email: 'ama@styleforward.com', phone: '+1-555-0505', address: '654 Fashion Lane', city: 'Los Angeles', country: 'USA', paymentTerms: 'Net 60', isActive: false, totalPurchases: 67000, createdAt: '2023-08-15T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
]

// ─── Users ───────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u-1', name: 'Admin User', email: 'admin@storems.com', role: 'admin', isActive: true, lastLogin: '2024-03-15T08:30:00Z', createdAt: '2023-01-01T10:00:00Z' },
  { id: 'u-2', name: 'Sarah Manager', email: 'sarah@storems.com', role: 'manager', isActive: true, lastLogin: '2024-03-15T09:00:00Z', createdAt: '2023-02-15T10:00:00Z' },
  { id: 'u-3', name: 'John Staff', email: 'john@storems.com', role: 'staff', isActive: true, lastLogin: '2024-03-14T17:00:00Z', createdAt: '2023-04-01T10:00:00Z' },
  { id: 'u-4', name: 'Emma Clark', email: 'emma@storems.com', role: 'staff', isActive: true, lastLogin: '2024-03-13T12:00:00Z', createdAt: '2023-06-10T10:00:00Z' },
  { id: 'u-5', name: 'Mike Johnson', email: 'mike@storems.com', role: 'manager', isActive: false, lastLogin: '2024-02-20T10:00:00Z', createdAt: '2023-09-01T10:00:00Z' },
]

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 128450.75,
  revenueGrowth: 12.5,
  totalOrders: 342,
  ordersGrowth: 8.3,
  totalProducts: 543,
  lowStockCount: 4,
  totalCustomers: 1284,
  customersGrowth: 5.7,
}

// ─── Revenue Chart Data ───────────────────────────────────────────────────────
export const mockRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
  { month: 'Feb', revenue: 38500, expenses: 25000, profit: 13500 },
  { month: 'Mar', revenue: 51000, expenses: 32000, profit: 19000 },
  { month: 'Apr', revenue: 47800, expenses: 30000, profit: 17800 },
  { month: 'May', revenue: 55200, expenses: 34000, profit: 21200 },
  { month: 'Jun', revenue: 62100, expenses: 38000, profit: 24100 },
  { month: 'Jul', revenue: 58400, expenses: 36000, profit: 22400 },
  { month: 'Aug', revenue: 64900, expenses: 39000, profit: 25900 },
  { month: 'Sep', revenue: 71200, expenses: 42000, profit: 29200 },
  { month: 'Oct', revenue: 68500, expenses: 41000, profit: 27500 },
  { month: 'Nov', revenue: 79400, expenses: 46000, profit: 33400 },
  { month: 'Dec', revenue: 92300, expenses: 52000, profit: 40300 },
]
