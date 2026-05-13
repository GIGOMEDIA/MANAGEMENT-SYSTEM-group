import { DollarSign, ShoppingCart, Package, Users, AlertTriangle } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { StatCard } from '@/shared/components/StatCard'
import { SkeletonCard, SkeletonRow } from '@/shared/components/LoadingStates'
import { Badge } from '@/shared/components/Badge'
import { formatCurrency, formatDateTime } from '@/shared/utils'
import {
  useDashboardStats, useRevenueData, useRecentTransactions, useLowStockProducts,
} from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData()
  const { data: transactions, isLoading: txLoading } = useRecentTransactions()
  const { data: lowStock, isLoading: stockLoading } = useLowStockProducts()

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              change={stats.revenueGrowth}
              icon={<DollarSign className="w-6 h-6" />}
              iconBg="bg-blue-600"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders.toLocaleString()}
              change={stats.ordersGrowth}
              icon={<ShoppingCart className="w-6 h-6" />}
              iconBg="bg-violet-600"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              icon={<Package className="w-6 h-6" />}
              iconBg="bg-emerald-600"
            />
            <StatCard
              title="Customers"
              value={stats.totalCustomers.toLocaleString()}
              change={stats.customersGrowth}
              icon={<Users className="w-6 h-6" />}
              iconBg="bg-orange-500"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Revenue Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monthly revenue, expenses & profit</p>
            </div>
          </div>
          {revenueLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                  formatter={(v: any) => [formatCurrency(Number(v)), '']}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revenue)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} fill="url(#profit)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Low Stock Alerts</h2>
            {lowStock && (
              <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">
                {lowStock.length}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {stockLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : lowStock?.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">All stock levels are healthy ✓</p>
            ) : (
              lowStock?.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sku}</p>
                  </div>
                  <Badge variant="warning">{p.quantity} left</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {txLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            transactions?.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.customerName}</p>
                  <p className="text-xs text-slate-500">{tx.invoiceNumber} · {formatDateTime(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(tx.total)}</p>
                  <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
