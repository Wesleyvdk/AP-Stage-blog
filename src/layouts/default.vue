<template>
  <div class="min-h-screen bg-gray-100">
    <nav-bar />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
