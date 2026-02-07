import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  username: string | null
  setAuth: (isAuthenticated: boolean, username?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  username: null,
  setAuth: (isAuthenticated, username) =>
    set({ isAuthenticated, username: username || null }),
  logout: () => set({ isAuthenticated: false, username: null }),
}))