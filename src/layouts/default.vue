<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
    <div class="inset-x-0 bottom-0">
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
