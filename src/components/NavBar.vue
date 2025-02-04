<template>
  <header class="bg-white shadow">
    <nav class="container mx-auto px-4 py-6 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-gray-800"> My Portfolio </router-link>
      <div class="space-x-4">
        <router-link to="/" class="text-gray-600 hover:text-gray-800">Home</router-link>
        <router-link to="/about" class="text-gray-600 hover:text-gray-800">About</router-link>
        <router-link to="/blog" class="text-gray-600 hover:text-gray-800">Blog</router-link>
        <template v-if="isAuthenticated">
          <router-link to="/dashboard" class="text-gray-600 hover:text-gray-800"
            >Dashboard</router-link
          >
          <button @click="logout" class="text-gray-600 hover:text-gray-800">Logout</button>
        </template>
        <router-link v-else to="/login" class="text-gray-600 hover:text-gray-800"
          >Login</router-link
        >
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, logout } = useAuth()
</script>
