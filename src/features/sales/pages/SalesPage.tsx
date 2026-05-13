import { useState } from 'react'
import { Plus, Receipt, TrendingUp, ShoppingCart, CheckCircle, Clock } from 'lucide-react'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { SearchInput, SelectInput } from '@/shared/components/FormInputs'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { StatCard } from '@/shared/components/StatCard'
import { SkeletonCard, LoadingSpinner } from '@/shared/components/LoadingStates'
import { useSales, useSalesStats, useCreateSale } from '@/features/sales/hooks/useSales'
import { useProducts } from '@/features/inventory/hooks/useProducts'
import { formatCurrency, formatDate } from '@/shared/utils'
import type { Sale, SaleItem } from '@/shared/types'
import { toast } from 'sonner'

type PaymentMethod = 'cash' | 'card' | 'transfer'

export function SalesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [createModal, setCreateModal] = useState(false)
  const [viewModal, setViewModal] = useState<Sale | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [cartItems, setCartItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [qty, setQty] = useState(1)

  const { data, isLoading } = useSales({ search, status, page, limit: 8 })
  const { data: statsData, isLoading: statsLoading } = useSalesStats()
  const { data: productsData } = useProducts({ limit: 100 })
  const createSale = useCreateSale()
  const products = productsData?.data ?? []

  const addToCart = () => {
    const prod = products.find(p => p.id === selectedProduct)
    if (!prod) { toast.error('Select a product'); return }
    const existing = cartItems.find(i => i.productId === prod.id)
    if (existing) {
      setCartItems(cartItems.map(i => i.productId === prod.id
        ? { ...i, quantity: i.quantity + qty, totalPrice: (i.quantity + qty) * i.unitPrice }
        : i))
    } else {
      setCartItems([...cartItems, {
        productId: prod.id, productName: prod.name, sku: prod.sku,
        quantity: qty, unitPrice: prod.price, totalPrice: qty * prod.price,
      }])
    }
    setSelectedProduct(''); setQty(1)
  }

  const subtotal = cartItems.reduce((s, i) => s + i.totalPrice, 0)
  const tax = subtotal * 0.09
  const total = subtotal + tax

  const handleCreateSale = async () => {
    if (!customerName.trim()) { toast.error('Customer name required'); return }
    if (!cartItems.length) { toast.error('Add at least one product'); return }
    await createSale.mutateAsync({
      customerName, items: cartItems, subtotal, tax, discount: 0,
      total, paymentMethod, status: 'completed', notes: '',
    })
    setCreateModal(false)
    setCartItems([]); setCustomerName(''); setPaymentMethod('cash')
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const columns: Column<Sale>[] = [
    {
      key: 'invoice', header: 'Invoice',
      render: s => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{s.invoiceNumber}</p>
          <p className="text-xs text-slate-400">{formatDate(s.createdAt)}</p>
        </div>
      ),
    },
    { key: 'customerName', header: 'Customer', render: s => <span className="font-medium">{s.customerName}</span> },
    { key: 'items', header: 'Items', render: s => `${s.items.length} item(s)` },
    { key: 'total', header: 'Total', render: s => <span className="font-semibold">{formatCurrency(s.total)}</span> },
    { key: 'paymentMethod', header: 'Payment', render: s => <Badge variant="info" className="capitalize">{s.paymentMethod}</Badge> },
    {
      key: 'status', header: 'Status',
      render: s => (
        <Badge variant={s.status === 'completed' ? 'success' : s.status === 'pending' ? 'warning' : 'danger'} className="capitalize">
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions', header: '',
      render: s => (
        <button onClick={() => setViewModal(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          <Receipt className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : statsData ? (
          <>
            <StatCard title="Total Revenue" value={formatCurrency(statsData.totalRevenue)} icon={<TrendingUp className="w-6 h-6" />} iconBg="bg-blue-600" />
            <StatCard title="Total Sales" value={String(statsData.totalSales)} icon={<ShoppingCart className="w-6 h-6" />} iconBg="bg-violet-600" />
            <StatCard title="Completed" value={String(statsData.completedSales)} icon={<CheckCircle className="w-6 h-6" />} iconBg="bg-emerald-600" />
            <StatCard title="Avg. Order" value={formatCurrency(statsData.averageOrderValue)} icon={<Clock className="w-6 h-6" />} iconBg="bg-orange-500" />
          </>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales Transactions</h2>
          <p className="text-sm text-slate-500 mt-0.5">{data?.total ?? 0} transactions</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25">
          <Plus className="w-4 h-4" /> New Sale
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput containerClassName="flex-1" placeholder="Search invoice or customer..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <SelectInput options={statusOptions} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} />
      </div>

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={s => s.id} isLoading={isLoading} page={page} totalPages={data?.totalPages} onPageChange={setPage} />

      {/* Create Sale Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="New Sale" description="Build a cart and record the sale" size="xl"
        footer={
          <>
            <button onClick={() => setCreateModal(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button onClick={handleCreateSale} disabled={createSale.isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl">
              {createSale.isPending && <LoadingSpinner size="sm" />} Record Sale
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Customer Name *</label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Acme Corp" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Product</label>
              <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white">
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>)}
              </select>
            </div>
            <div className="w-24">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Qty</label>
              <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
            </div>
            <div className="flex items-end">
              <button onClick={addToCart} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl">Add</button>
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Product', 'Qty', 'Unit Price', 'Total', ''].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cartItems.map(item => (
                    <tr key={item.productId}>
                      <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{item.productName}</td>
                      <td className="px-3 py-2 text-slate-500">{item.quantity}</td>
                      <td className="px-3 py-2 text-slate-500">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 font-semibold">{formatCurrency(item.totalPrice)}</td>
                      <td className="px-3 py-2"><button onClick={() => setCartItems(cartItems.filter(i => i.productId !== item.productId))} className="text-red-400 hover:text-red-600 text-xs">✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-sm text-right space-y-1">
                <p className="text-slate-500">Subtotal: <strong className="text-slate-900 dark:text-white">{formatCurrency(subtotal)}</strong></p>
                <p className="text-slate-500">Tax (9%): <strong className="text-slate-900 dark:text-white">{formatCurrency(tax)}</strong></p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Total: {formatCurrency(total)}</p>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Payment Method</label>
            <div className="flex gap-3">
              {(['cash', 'card', 'transfer'] as PaymentMethod[]).map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${paymentMethod === m ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* View Sale Modal */}
      {viewModal && (
        <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title={`Invoice — ${viewModal.invoiceNumber}`} size="md">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-slate-400 mb-0.5">Customer</p><p className="font-medium text-slate-900 dark:text-white">{viewModal.customerName}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Date</p><p className="font-medium text-slate-900 dark:text-white">{formatDate(viewModal.createdAt)}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Payment</p><p className="capitalize font-medium text-slate-900 dark:text-white">{viewModal.paymentMethod}</p></div>
              <div><p className="text-xs text-slate-400 mb-0.5">Status</p><Badge variant={viewModal.status === 'completed' ? 'success' : 'warning'} className="capitalize">{viewModal.status}</Badge></div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              {viewModal.items.map(item => (
                <div key={item.productId} className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatCurrency(viewModal.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax</span><span>{formatCurrency(viewModal.tax)}</span></div>
              {viewModal.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatCurrency(viewModal.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800"><span>Total</span><span>{formatCurrency(viewModal.total)}</span></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
