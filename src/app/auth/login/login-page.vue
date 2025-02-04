<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-6">Login</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label for="password" class="block mb-1">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </form>
    <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const error = ref('')

const { login } = useAuth()

const handleSubmit = async () => {
  try {
    await login(email.value, password.value)
  } catch (err) {
    error.value = 'Invalid email or password'
  }
}
</script>
