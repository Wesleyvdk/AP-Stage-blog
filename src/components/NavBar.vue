<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="flex items-center">
          <span class="ml-2 text-xl font-semibold">Blog AP</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-4">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-indigo-600': isCurrentRoute(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <div class="flex items-center">
          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <button
              @click="handleLogout"
              class="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/auth/login"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Login
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, logout } = useAuth()

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
]

const isCurrentRoute = (path) => route.path === path

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}
</script>
