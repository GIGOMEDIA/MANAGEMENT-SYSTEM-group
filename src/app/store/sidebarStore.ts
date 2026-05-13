import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  open: () => void
  close: () => void
  toggleCollapse: () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: true,
  isCollapsed: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
}))
