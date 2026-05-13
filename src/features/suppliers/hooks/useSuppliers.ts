import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { mockSuppliers } from '@/shared/constants/mockData'
import type { Supplier } from '@/shared/types'
import { toast } from 'sonner'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

let suppliers = [...mockSuppliers]
let nextId = suppliers.length + 1

export function useSuppliers(filters: { search?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.suppliers.lists(),
    queryFn: async () => {
      await delay(500)
      let filtered = [...suppliers]
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        )
      }
      const page = filters.page ?? 1
      const limit = filters.limit ?? 8
      const total = filtered.length
      const data = filtered.slice((page - 1) * limit, page * limit)
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
    },
  })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'totalPurchases'>) => {
      await delay(600)
      const newSupplier: Supplier = {
        ...data,
        id: `sup-${nextId++}`,
        totalPurchases: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      suppliers.unshift(newSupplier)
      return newSupplier
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.suppliers.all }); toast.success('Supplier added') },
    onError: () => toast.error('Failed to add supplier'),
  })
}

export function useUpdateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Supplier> }) => {
      await delay(600)
      const idx = suppliers.findIndex(s => s.id === id)
      if (idx === -1) throw new Error('Supplier not found')
      suppliers[idx] = { ...suppliers[idx], ...data, updatedAt: new Date().toISOString() }
      return suppliers[idx]
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.suppliers.all }); toast.success('Supplier updated') },
    onError: () => toast.error('Failed to update supplier'),
  })
}

export function useDeleteSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await delay(400); suppliers = suppliers.filter(s => s.id !== id) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.suppliers.all }); toast.success('Supplier deleted') },
    onError: () => toast.error('Failed to delete supplier'),
  })
}
