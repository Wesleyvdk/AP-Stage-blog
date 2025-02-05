import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'

export async function useAuth() {
  const store = await useAuthStore()
  const { user, isAuthenticated } = await storeToRefs(store)

  console.log('useAuth called', store, user, isAuthenticated)

  return {
    user,
    isAuthenticated,
    login: async (email, password) => {
      console.log('useAuth login called with:', email, password)
      return store.login(email, password)
    },
    logout: store.logout,
  }
}
