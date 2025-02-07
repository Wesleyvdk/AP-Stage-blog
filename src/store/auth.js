import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser } from '@/services/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password)
      await localStorage.setItem('token', response.token)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }

  const isUserAuthenticated = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      isAuthenticated.value = true
    }
  }

  const logout = async () => {
    await localStorage.removeItem('token')
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isUserAuthenticated,
    login,
    logout,
  }
})
