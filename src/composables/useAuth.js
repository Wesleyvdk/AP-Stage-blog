import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'

export async function useAuth() {
  const store = await useAuthStore()
  const { user, isAuthenticated } = await storeToRefs(store)

  return {
    user,
    isAuthenticated: store.isUserAuthenticated,
    login: async (email, password) => {
      return store.login(email, password)
    },
    logout: store.logout,
  }
}
