import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { mockRevenueData, mockProducts, mockSales } from '@/shared/constants/mockData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Download, TrendingUp, Package, ShoppingCart } from 'lucide-react'
import { formatCurrency, downloadCSV } from '@/shared/utils'
import { StatCard } from '@/shared/components/StatCard'
import { Badge } from '@/shared/components/Badge'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function ReportsPage() {
  const [range, setRange] = useState<'6m' | '12m'>('12m')

  const { data: revenueData, isLoading: revLoading } = useQuery({
    queryKey: queryKeys.reports.revenue(range),
    queryFn: async () => {
      await delay(600)
      const data = range === '6m' ? mockRevenueData.slice(-6) : mockRevenueData
      return data
    },
  })

  const { data: productData } = useQuery({
    queryKey: queryKeys.reports.products(),
    queryFn: async () => {
      await delay(400)
      return mockProducts
        .map(p => ({ name: p.name.slice(0, 18), revenue: p.price * (100 - p.quantity), category: p.category }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    },
  })

  const categoryData = mockProducts.reduce((acc, p) => {
    const existing = acc.find(a => a.name === p.category)
    if (existing) existing.value += 1
    else acc.push({ name: p.category, value: 1 })
    return acc
  }, [] as { name: string; value: number }[])

  const totalRevenue = mockSales.filter(s => s.status === 'completed').reduce((s, sale) => s + sale.total, 0)
  const totalProfit = totalRevenue * 0.38

  const handleExportRevenue = () => {
    const rows = (revenueData ?? []).map(d => ({
      Month: d.month,
      Revenue: d.revenue,
      Expenses: d.expenses,
      Profit: d.profit,
    }))
    downloadCSV(rows as unknown as Record<string, unknown>[], `revenue-report-${range}.csv`)
  }

  const handleExportSales = () => {
    const rows = mockSales.map(s => ({
      Invoice: s.invoiceNumber,
      Customer: s.customerName,
      Total: s.total,
      Status: s.status,
      Date: s.createdAt.split('T')[0],
    }))
    downloadCSV(rows as unknown as Record<string, unknown>[], 'sales-report.csv')
  }

  const ranges: { value: '6m' | '12m'; label: string }[] = [
    { value: '6m', label: 'Last 6 months' },
    { value: '12m', label: 'Last 12 months' },
  ]

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} change={12.5} icon={<TrendingUp className="w-6 h-6" />} iconBg="bg-blue-600" />
        <StatCard title="Net Profit" value={formatCurrency(totalProfit)} change={8.2} icon={<ShoppingCart className="w-6 h-6" />} iconBg="bg-emerald-600" />
        <StatCard title="Products Tracked" value={String(mockProducts.length)} icon={<Package className="w-6 h-6" />} iconBg="bg-violet-600" />
      </div>

      {/* Revenue Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Revenue vs Expenses</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monthly breakdown</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {ranges.map(r => (
                <button key={r.value} onClick={() => setRange(r.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${range === r.value ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={handleExportRevenue} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl transition-colors">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {revLoading ? (
          <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} formatter={(v: any) => [formatCurrency(Number(v || 0)), '']} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Top Performing Products</h2>
          <div className="space-y-3">
            {productData?.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min((p.revenue / (productData[0]?.revenue || 1)) * 100, 100)}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">{formatCurrency(p.revenue)}</span>
                <Badge variant="info">{p.category.split(' ')[0]}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Sales */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Sales Report</h3>
          <p className="text-sm text-slate-500 mt-0.5">Download full transaction history as CSV</p>
        </div>
        <button onClick={handleExportSales} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all">
          <Download className="w-4 h-4" /> Export Sales CSV
        </button>
      </div>
    </div>
  )
}
