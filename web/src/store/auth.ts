import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { create } from 'zustand'
import { auth } from '../lib/firebase'
import { listClinics } from '../lib/api'
import type { Clinic } from '../types'

type ClinicsStatus = 'idle' | 'loading' | 'ready'

const ACTIVE_CLINIC_KEY = 'active_clinic_id'

function readActiveClinicId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CLINIC_KEY)
  } catch {
    return null
  }
}

function persistActiveClinicId(id: string | null) {
  try {
    if (id) localStorage.setItem(ACTIVE_CLINIC_KEY, id)
    else localStorage.removeItem(ACTIVE_CLINIC_KEY)
  } catch {
    return
  }
}

interface AuthState {
  user: User | null
  uid: string | null
  email: string | null
  loading: boolean
  clinics: Clinic[]
  activeClinicId: string | null
  clinicsStatus: ClinicsStatus
  setActiveClinic: (id: string) => void
  refreshClinics: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  uid: null,
  email: null,
  loading: true,
  clinics: [],
  activeClinicId: readActiveClinicId(),
  clinicsStatus: 'idle',
  setActiveClinic: (id) => {
    persistActiveClinicId(id)
    set({ activeClinicId: id })
  },
  refreshClinics: async () => {
    set({ clinicsStatus: 'loading' })
    try {
      const clinics = await listClinics()
      const preferred = [get().activeClinicId, readActiveClinicId()].find(
        (id) => id != null && clinics.some((clinic) => clinic.id === id),
      )
      const activeClinicId = preferred ?? clinics[0]?.id ?? null
      persistActiveClinicId(activeClinicId)
      set({ clinics, activeClinicId, clinicsStatus: 'ready' })
    } catch {
      set({ clinics: [], clinicsStatus: 'ready' })
    }
  },
}))

onAuthStateChanged(auth, (user) => {
  if (user) {
    useAuthStore.setState({
      user,
      uid: user.uid,
      email: user.email,
      loading: false,
    })
    void useAuthStore.getState().refreshClinics()
  } else {
    persistActiveClinicId(null)
    useAuthStore.setState({
      user: null,
      uid: null,
      email: null,
      loading: false,
      clinics: [],
      activeClinicId: null,
      clinicsStatus: 'idle',
    })
  }
})
