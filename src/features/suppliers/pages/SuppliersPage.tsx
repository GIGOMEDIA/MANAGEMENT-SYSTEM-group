import { useState } from 'react'
import { Plus, Pencil, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { SearchInput } from '@/shared/components/FormInputs'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { LoadingSpinner } from '@/shared/components/LoadingStates'
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '@/features/suppliers/hooks/useSuppliers'
import { formatCurrency } from '@/shared/utils'
import type { Supplier } from '@/shared/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const supplierSchema = z.object({
  name: z.string().min(2, 'Name required'),
  contactPerson: z.string().min(2, 'Contact person required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  address: z.string().min(3, 'Address required'),
  city: z.string().min(2, 'City required'),
  country: z.string().min(2, 'Country required'),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  isActive: z.boolean(),
})

type SupplierForm = z.infer<typeof supplierSchema>

export function SuppliersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [deleteModal, setDeleteModal] = useState<Supplier | null>(null)

  const { data, isLoading } = useSuppliers({ search, page })
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { isActive: true },
  })

  const openCreate = () => { setEditSupplier(null); reset({ isActive: true }); setModalOpen(true) }
  const openEdit = (s: Supplier) => {
    setEditSupplier(s)
    reset({ name: s.name, contactPerson: s.contactPerson, email: s.email, phone: s.phone, address: s.address, city: s.city, country: s.country, taxId: s.taxId, paymentTerms: s.paymentTerms, isActive: s.isActive })
    setModalOpen(true)
  }

  const onSubmit = async (data: SupplierForm) => {
    if (editSupplier) await updateSupplier.mutateAsync({ id: editSupplier.id, data })
    else await createSupplier.mutateAsync(data)
    setModalOpen(false); reset()
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    await deleteSupplier.mutateAsync(deleteModal.id)
    setDeleteModal(null)
  }

  const columns: Column<Supplier>[] = [
    {
      key: 'name', header: 'Supplier',
      render: s => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{s.name}</p>
          <p className="text-xs text-slate-400">{s.contactPerson}</p>
        </div>
      ),
    },
    {
      key: 'contact', header: 'Contact',
      render: s => (
        <div className="space-y-0.5">
          <p className="flex items-center gap-1 text-xs text-slate-500"><Mail className="w-3 h-3" />{s.email}</p>
          <p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="w-3 h-3" />{s.phone}</p>
        </div>
      ),
    },
    {
      key: 'location', header: 'Location',
      render: s => (
        <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="w-3 h-3" />{s.city}, {s.country}
        </p>
      ),
    },
    { key: 'paymentTerms', header: 'Payment Terms', render: s => s.paymentTerms ?? '—' },
    { key: 'totalPurchases', header: 'Total Purchases', render: s => <span className="font-medium">{formatCurrency(s.totalPurchases)}</span> },
    { key: 'isActive', header: 'Status', render: s => <Badge variant={s.isActive ? 'success' : 'secondary'}>{s.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', header: '',
      render: s => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteModal(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ]

  const inputCls = "w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
  const labelCls = "text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suppliers</h2>
          <p className="text-sm text-slate-500 mt-0.5">{data?.total ?? 0} suppliers total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <SearchInput containerClassName="max-w-sm" placeholder="Search suppliers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={s => s.id} isLoading={isLoading} page={page} totalPages={data?.totalPages} onPageChange={setPage} />

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editSupplier ? 'Edit Supplier' : 'Add Supplier'} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button onClick={handleSubmit(onSubmit)} disabled={createSupplier.isPending || updateSupplier.isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl">
              {(createSupplier.isPending || updateSupplier.isPending) && <LoadingSpinner size="sm" />}
              {editSupplier ? 'Save Changes' : 'Add Supplier'}
            </button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className={labelCls}>Company Name *</label><input {...register('name')} placeholder="e.g. TechVision Distributors" className={inputCls} />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
          <div><label className={labelCls}>Contact Person *</label><input {...register('contactPerson')} placeholder="e.g. James Wilson" className={inputCls} />{errors.contactPerson && <p className="text-xs text-red-500 mt-1">{errors.contactPerson.message}</p>}</div>
          <div><label className={labelCls}>Email *</label><input {...register('email')} type="email" placeholder="contact@company.com" className={inputCls} />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
          <div><label className={labelCls}>Phone *</label><input {...register('phone')} placeholder="+1-555-0000" className={inputCls} /></div>
          <div><label className={labelCls}>Payment Terms</label><input {...register('paymentTerms')} placeholder="e.g. Net 30" className={inputCls} /></div>
          <div className="col-span-2"><label className={labelCls}>Address *</label><input {...register('address')} placeholder="Street address" className={inputCls} /></div>
          <div><label className={labelCls}>City *</label><input {...register('city')} placeholder="City" className={inputCls} /></div>
          <div><label className={labelCls}>Country *</label><input {...register('country')} placeholder="Country" className={inputCls} /></div>
          <div><label className={labelCls}>Tax ID</label><input {...register('taxId')} placeholder="Optional" className={inputCls} /></div>
          <div className="flex items-center gap-2 mt-6">
            <input {...register('isActive')} type="checkbox" id="isActive" className="w-4 h-4 accent-blue-600" />
            <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-slate-300">Active supplier</label>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Supplier" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button onClick={handleDelete} disabled={deleteSupplier.isPending} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl">
              {deleteSupplier.isPending && <LoadingSpinner size="sm" />} Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">Delete <strong className="text-slate-900 dark:text-white">{deleteModal?.name}</strong>? This cannot be undone.</p>
      </Modal>
    </div>
  )
}
