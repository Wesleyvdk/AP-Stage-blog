import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginUser } from '@/services/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  console.log('starting auth store')
  const login = async (email, password) => {
    try {
      console.log('Logging in with:', email, password)
      const response = await loginUser(email, password)
      console.log('Login response:', response)
      await localStorage.setItem('token', response.token)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
})
