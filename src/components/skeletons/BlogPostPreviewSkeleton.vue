<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <article
      v-for="n in count"
      :key="n"
      class="bg-white rounded-lg shadow-md overflow-hidden h-[400px] flex flex-col"
    >
      <div class="p-6 flex flex-col h-full animate-pulse">
        <!-- Date skeleton -->
        <div class="flex items-center mb-3">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        <!-- Title skeleton -->
        <div class="mb-2">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>

        <!-- Content skeleton with gradient -->
        <div class="relative flex-grow overflow-hidden">
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-4/5"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <!-- Tags skeleton -->
        <div class="flex flex-wrap gap-2 mt-auto pt-4">
          <div class="h-5 bg-indigo-100 rounded w-16"></div>
          <div class="h-5 bg-indigo-100 rounded w-20"></div>
          <div class="h-5 bg-indigo-100 rounded w-14"></div>
        </div>

        <!-- Read more skeleton -->
        <div class="flex items-center justify-between mt-4">
          <div class="h-5 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>

