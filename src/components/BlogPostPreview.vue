<template>
  <article
    :key="post.id"
    class="prose prose-lg bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
  >
    <div class="p-6 flex flex-col h-[400px]"> <!-- Set fixed height and use flex column -->
      <div class="flex items-center mb-3">
        <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        <router-link :to="`/blog/${post.id}`" class="hover:text-indigo-600">
          {{ post.title }}
        </router-link>
      </h2>
      <div class="relative flex-grow overflow-hidden">
        <p
          class="text-gray-600 mb-4 prose-sm prose"
          v-html="parseMarkdown(post.content)"
        ></p>
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      <div class="flex flex-wrap gap-2 mt-auto pt-4">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center justify-between mt-4">
        <router-link
          :to="`/blog/${post.id}`"
          class="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Read more →
        </router-link>
      </div>
    </div>
  </article>
</template>

<style scoped>

/* Optional: Add smooth transition for the gradient fade */
.bg-gradient-to-t {
  transition: opacity 0.3s ease;
}

/* Optional: Show more content on hover */
article:hover .prose {
  max-height: 220px;
}
</style>

<script setup>
import { formatDate } from '@/helpers/date'
import { parseMarkdown } from '@/helpers/markdown'
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>
