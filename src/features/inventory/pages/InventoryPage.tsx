import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { SearchInput, SelectInput } from '@/shared/components/FormInputs'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { EmptyState } from '@/shared/components/EmptyState'
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/features/inventory/hooks/useProducts'
import { formatCurrency } from '@/shared/utils'
import type { Product } from '@/shared/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoadingSpinner } from '@/shared/components/LoadingStates'

const productSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  sku: z.string().min(2, 'SKU required'),
  categoryId: z.string().min(1, 'Category required'),
  category: z.string(),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
  costPrice: z.coerce.number().min(0.01, 'Cost must be positive'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be >= 0'),
  lowStockThreshold: z.coerce.number().int().min(1),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

export function InventoryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const { data, isLoading } = useProducts({ search, category, page, limit: 8 })
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true, lowStockThreshold: 10 },
  })

  const openCreate = () => {
    setEditProduct(null)
    reset({ isActive: true, lowStockThreshold: 10 })
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    reset({
      name: p.name, sku: p.sku, categoryId: p.categoryId, category: p.category,
      price: p.price, costPrice: p.costPrice, quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold, description: p.description, isActive: p.isActive,
    })
    setModalOpen(true)
  }

  const onSubmit = async (data: ProductFormData) => {
    const cat = categories?.find(c => c.id === data.categoryId)
    const payload = { ...data, category: cat?.name ?? data.categoryId, imageUrl: undefined }
    if (editProduct) {
      await updateProduct.mutateAsync({ id: editProduct.id, data: payload })
    } else {
      await createProduct.mutateAsync(payload)
    }
    setModalOpen(false)
    reset()
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    await deleteProduct.mutateAsync(deleteModal.id)
    setDeleteModal(null)
  }

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...(categories?.map(c => ({ value: c.id, label: c.name })) ?? []),
  ]

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: p => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
          <p className="text-xs text-slate-400">{p.sku}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: p => <Badge variant="info">{p.category}</Badge> },
    { key: 'price', header: 'Price', render: p => formatCurrency(p.price) },
    { key: 'costPrice', header: 'Cost', render: p => formatCurrency(p.costPrice) },
    {
      key: 'quantity',
      header: 'Stock',
      render: p => (
        <div className="flex items-center gap-2">
          <span className={p.quantity <= p.lowStockThreshold ? 'text-red-600 font-semibold' : 'text-slate-700 dark:text-slate-300'}>
            {p.quantity}
          </span>
          {p.quantity <= p.lowStockThreshold && (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
        </div>
      ),
    },
    { key: 'isActive', header: 'Status', render: p => <Badge variant={p.isActive ? 'success' : 'secondary'}>{p.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: p => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteModal(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">{data?.total ?? 0} products total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          containerClassName="flex-1"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <SelectInput
          options={categoryOptions}
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1) }}
        />
      </div>

      {/* Table */}
      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or add a new product."
          action={
            <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">
              Add Product
            </button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          keyExtractor={p => p.id}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={createProduct.isPending || updateProduct.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {(createProduct.isPending || updateProduct.isPending) && <LoadingSpinner size="sm" />}
              {editProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name *</label>
              <input {...register('name')} placeholder="e.g. Wireless Headphones" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SKU *</label>
              <input {...register('sku')} placeholder="e.g. EL-001" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
              <select {...register('categoryId')} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white">
                <option value="">Select category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selling Price *</label>
              <input {...register('price')} type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cost Price *</label>
              <input {...register('costPrice')} type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              {errors.costPrice && <p className="text-xs text-red-500">{errors.costPrice.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stock Qty *</label>
              <input {...register('quantity')} type="number" placeholder="0" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Low Stock Alert</label>
              <input {...register('lowStockThreshold')} type="number" placeholder="10" className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea {...register('description')} rows={3} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none" />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
            >
              {deleteProduct.isPending && <LoadingSpinner size="sm" />}
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteModal?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
