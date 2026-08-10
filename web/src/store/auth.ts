import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { create } from 'zustand'
import { auth } from '../lib/firebase'
import { getMyClinic } from '../lib/api'
import type { Clinic } from '../types'

type ClinicStatus = 'idle' | 'loading' | 'ready'

interface AuthState {
  user: User | null
  uid: string | null
  email: string | null
  loading: boolean
  clinic: Clinic | null
  clinicStatus: ClinicStatus
  fetchClinic: () => Promise<void>
  setClinic: (clinic: Clinic) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  uid: null,
  email: null,
  loading: true,
  clinic: null,
  clinicStatus: 'idle',
  fetchClinic: async () => {
    set({ clinicStatus: 'loading' })
    try {
      const clinic = await getMyClinic()
      set({ clinic, clinicStatus: 'ready' })
    } catch {
      set({ clinic: null, clinicStatus: 'ready' })
    }
  },
  setClinic: (clinic) => set({ clinic }),
}))

onAuthStateChanged(auth, (user) => {
  if (user) {
    useAuthStore.setState({
      user,
      uid: user.uid,
      email: user.email,
      loading: false,
    })
    void useAuthStore.getState().fetchClinic()
  } else {
    useAuthStore.setState({
      user: null,
      uid: null,
      email: null,
      loading: false,
      clinic: null,
      clinicStatus: 'idle',
    })
  }
})
