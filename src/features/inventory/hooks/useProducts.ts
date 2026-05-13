import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { mockProducts, mockCategories } from '@/shared/constants/mockData'
import type { Product } from '@/shared/types'
import { toast } from 'sonner'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// In-memory store for mock CRUD
let products = [...mockProducts]
let nextId = products.length + 1

export function useProducts(filters: { search?: string; category?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      await delay(500)
      let filtered = [...products]
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        )
      }
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.categoryId === filters.category)
      }
      const page = filters.page ?? 1
      const limit = filters.limit ?? 8
      const total = filtered.length
      const data = filtered.slice((page - 1) * limit, page * limit)
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories(),
    queryFn: async () => { await delay(300); return mockCategories },
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay(600)
      const newProduct: Product = {
        ...data,
        id: `p-${nextId++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.unshift(newProduct)
      return newProduct
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product created successfully')
    },
    onError: () => toast.error('Failed to create product'),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      await delay(600)
      const idx = products.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Product not found')
      products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() }
      return products[idx]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product updated successfully')
    },
    onError: () => toast.error('Failed to update product'),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(400)
      products = products.filter(p => p.id !== id)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Failed to delete product'),
  })
}
