<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

onMounted(() => {
  // Check if the user is already authenticated (e.g., from a previous session)
  if (localStorage.getItem('token')) {
    isAuthenticated.value = true
  }
})
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
