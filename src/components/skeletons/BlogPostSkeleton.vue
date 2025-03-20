<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-8 animate-pulse">
      <!-- Title skeleton -->
      <div class="flex items-center justify-between mb-6">
        <div class="h-10 bg-gray-200 rounded w-3/4"></div>
        <div class="flex space-x-4">
          <div class="h-6 bg-gray-200 rounded w-16"></div>
          <div class="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      <!-- Tags skeleton -->
      <div class="flex flex-wrap gap-2 mb-4">
        <div class="h-5 bg-indigo-100 rounded w-16"></div>
        <div class="h-5 bg-indigo-100 rounded w-20"></div>
        <div class="h-5 bg-indigo-100 rounded w-14"></div>
      </div>

      <!-- Date and author skeleton -->
      <div class="flex items-center mb-8">
        <div class="h-4 bg-gray-200 rounded w-32"></div>
        <div class="mx-2">•</div>
        <div class="h-4 bg-gray-200 rounded w-24"></div>
      </div>

      <!-- Content skeleton -->
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-4/5"></div>

        <div class="h-20 bg-gray-200 rounded w-full mt-6"></div>

        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>

        <div class="h-32 bg-gray-200 rounded w-full mt-6"></div>

        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
</template>

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

