import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import {
  mockDashboardStats, mockRevenueData, mockSales, mockProducts,
} from '@/shared/constants/mockData'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => { await delay(600); return mockDashboardStats },
  })
}

export function useRevenueData() {
  return useQuery({
    queryKey: queryKeys.reports.revenue('yearly'),
    queryFn: async () => { await delay(800); return mockRevenueData },
  })
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: queryKeys.dashboard.recentTransactions(),
    queryFn: async () => { await delay(500); return mockSales.slice(0, 5) },
  })
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: queryKeys.dashboard.lowStock(),
    queryFn: async () => {
      await delay(400)
      return mockProducts.filter(p => p.quantity <= p.lowStockThreshold)
    },
  })
}
