import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { registerClinic } from '../lib/api'
import type { ClinicCreate } from '../types'

interface ClinicProfile {
  id: string
  name?: string
  vet_name?: string
  email?: string
}

interface AuthState {
  apiKey: string | null
  clinic: ClinicProfile | null
  login: (apiKey: string) => void
  register: (input: ClinicCreate) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      clinic: null,
      login: (apiKey) => set({ apiKey: apiKey.trim(), clinic: null }),
      register: async (input) => {
        const registered = await registerClinic(input)
        set({
          apiKey: registered.api_key,
          clinic: {
            id: registered.id,
            name: input.name,
            vet_name: input.vet_name,
            email: input.email,
          },
        })
      },
      logout: () => set({ apiKey: null, clinic: null }),
    }),
    { name: 'vet-auth' },
  ),
)

export const getApiKey = () => useAuthStore.getState().apiKey
