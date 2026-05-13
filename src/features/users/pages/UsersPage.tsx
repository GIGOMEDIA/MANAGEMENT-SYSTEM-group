import { useState } from 'react'
import { Plus, Pencil, Trash2, Mail, Shield } from 'lucide-react'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { SearchInput, SelectInput } from '@/shared/components/FormInputs'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
import { LoadingSpinner } from '@/shared/components/LoadingStates'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/features/users/hooks/useUsers'
import { formatDate } from '@/shared/utils'
import type { User } from '@/shared/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'manager', 'staff']),
  isActive: z.boolean(),
})

type UserForm = z.infer<typeof userSchema>

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteModal, setDeleteModal] = useState<User | null>(null)

  const { data, isLoading } = useUsers({ search, role, page })
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { isActive: true, role: 'staff' },
  })

  const openCreate = () => { setEditUser(null); reset({ isActive: true, role: 'staff' }); setModalOpen(true) }
  const openEdit = (u: User) => {
    setEditUser(u)
    reset({ name: u.name, email: u.email, role: u.role, isActive: u.isActive })
    setModalOpen(true)
  }

  const onSubmit = async (data: UserForm) => {
    if (editUser) await updateUser.mutateAsync({ id: editUser.id, data })
    else await createUser.mutateAsync(data)
    setModalOpen(false); reset()
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    await deleteUser.mutateAsync(deleteModal.id)
    setDeleteModal(null)
  }

  const roleColors: Record<string, 'danger' | 'warning' | 'info'> = {
    admin: 'danger',
    manager: 'warning',
    staff: 'info',
  }

  const columns: Column<User>[] = [
    {
      key: 'user', header: 'User',
      render: u => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500"><Mail className="w-3 h-3" />{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', header: 'Role',
      render: u => (
        <Badge variant={roleColors[u.role]}>
          <span className="flex items-center gap-1 capitalize"><Shield className="w-3 h-3" /> {u.role}</span>
        </Badge>
      ),
    },
    { key: 'lastLogin', header: 'Last Login', render: u => u.lastLogin ? formatDate(u.lastLogin) : 'Never' },
    { key: 'isActive', header: 'Status', render: u => <Badge variant={u.isActive ? 'success' : 'secondary'}>{u.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions', header: '',
      render: u => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDeleteModal(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">{data?.total ?? 0} users total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput containerClassName="max-w-sm flex-1" placeholder="Search users by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <SelectInput options={[{ value: 'all', label: 'All Roles' }, { value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'staff', label: 'Staff' }]} value={role} onChange={e => { setRole(e.target.value); setPage(1) }} />
      </div>

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={u => u.id} isLoading={isLoading} page={page} totalPages={data?.totalPages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Add New User'} size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button onClick={handleSubmit(onSubmit)} disabled={createUser.isPending || updateUser.isPending} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl">
              {(createUser.isPending || updateUser.isPending) && <LoadingSpinner size="sm" />}
              {editUser ? 'Save Changes' : 'Add User'}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div><label className={labelCls}>Full Name *</label><input {...register('name')} placeholder="e.g. Jane Doe" className={inputCls} />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}</div>
          <div><label className={labelCls}>Email Address *</label><input {...register('email')} type="email" placeholder="jane@company.com" className={inputCls} />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}</div>
          <div>
            <label className={labelCls}>Role *</label>
            <select {...register('role')} className={inputCls}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input {...register('isActive')} type="checkbox" id="isActive" className="w-4 h-4 accent-blue-600" />
            <label htmlFor="isActive" className="text-sm text-slate-700 dark:text-slate-300">Active account</label>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete User" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button>
            <button onClick={handleDelete} disabled={deleteUser.isPending} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl">
              {deleteUser.isPending && <LoadingSpinner size="sm" />} Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">Delete user <strong className="text-slate-900 dark:text-white">{deleteModal?.name}</strong>? They will immediately lose access to the system.</p>
      </Modal>
    </div>
  )
}
