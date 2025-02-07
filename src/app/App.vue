<template>
  <div class="min-h-screen bg-gray-50">
    <Suspense>
      <NavBar />
      <template #fallback>
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </template>
    </Suspense>

    <main class="container mx-auto px-4 py-8">
      <Suspense>
        <router-view />
      </Suspense>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

/* const { isAuthenticated } = await useAuth()

onMounted(() => {
  // Check if the user is already authenticated (e.g., from a previous session)
  if (localStorage.getItem('token')) {
    isAuthenticated.value = true
  }
}) */
</script>

<style>
@import '../assets/tailwind.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
