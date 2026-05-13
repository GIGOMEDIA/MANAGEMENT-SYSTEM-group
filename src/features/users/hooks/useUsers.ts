import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { mockUsers } from '@/shared/constants/mockData'
import type { User } from '@/shared/types'
import { toast } from 'sonner'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

let users = [...mockUsers]
let nextId = users.length + 1

export function useUsers(filters: { search?: string; role?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: async () => {
      await delay(500)
      let filtered = [...users]
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        )
      }
      if (filters.role && filters.role !== 'all') {
        filtered = filtered.filter(u => u.role === filters.role)
      }
      const page = filters.page ?? 1
      const limit = filters.limit ?? 8
      const total = filtered.length
      const data = filtered.slice((page - 1) * limit, page * limit)
      return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
      await delay(600)
      const newUser: User = {
        ...data,
        id: `u-${nextId++}`,
        createdAt: new Date().toISOString(),
      }
      users.unshift(newUser)
      return newUser
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User added successfully') },
    onError: () => toast.error('Failed to add user'),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      await delay(600)
      const idx = users.findIndex(u => u.id === id)
      if (idx === -1) throw new Error('User not found')
      users[idx] = { ...users[idx], ...data }
      return users[idx]
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User updated successfully') },
    onError: () => toast.error('Failed to update user'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await delay(400); users = users.filter(u => u.id !== id) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.users.all }); toast.success('User deleted successfully') },
    onError: () => toast.error('Failed to delete user'),
  })
}
