import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { mockSales } from '@/shared/constants/mockData'
import type { Sale } from '@/shared/types'
import { toast } from 'sonner'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

let sales = [...mockSales]
let invoiceCounter = 7

export function useSales(filters: { search?: string; status?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.sales.list(filters),
    queryFn: async () => {
      await delay(500)
      let filtered = [...sales]
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.invoiceNumber.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
        )
      }
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(s => s.status === filters.status)
      }
      const page = filters.page ?? 1
      const limit = filters.limit ?? 8
      const total = filtered.length
      const data = filtered.slice((page - 1) * limit, page * limit)
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
    },
  })
}

export function useSalesStats() {
  return useQuery({
    queryKey: queryKeys.sales.stats(),
    queryFn: async () => {
      await delay(400)
      const completed = sales.filter(s => s.status === 'completed')
      return {
        totalRevenue: completed.reduce((sum, s) => sum + s.total, 0),
        totalSales: sales.length,
        completedSales: completed.length,
        pendingSales: sales.filter(s => s.status === 'pending').length,
        averageOrderValue: completed.length ? completed.reduce((s, sale) => s + sale.total, 0) / completed.length : 0,
      }
    },
  })
}

export function useCreateSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Sale, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
      await delay(700)
      const newSale: Sale = {
        ...data,
        id: `s-${Date.now()}`,
        invoiceNumber: `INV-2024-${String(invoiceCounter++).padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      sales.unshift(newSale)
      return newSale
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sales.all })
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      toast.success('Sale recorded successfully')
    },
    onError: () => toast.error('Failed to record sale'),
  })
}
