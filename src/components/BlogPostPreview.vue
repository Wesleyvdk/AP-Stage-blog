<template>
  <article
    v-for="post in posts"
    :key="post.id"
    class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
  >
    <div class="p-6">
      <div class="flex items-center mb-3">
        <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        <router-link :to="`/blog/${post.id}`" class="hover:text-indigo-600">
          {{ post.title }}
        </router-link>
      </h2>
      <p class="text-gray-600 mb-4" v-html="parseMarkdown(post.content)"></p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>
      <div class="flex items-center justify-between">
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

<script setup>
import { formatDate } from '@/helpers/date'
import { ref, watchEffect } from 'vue'
import { parseMarkdown } from '@/helpers/markdown'
const posts = ref(null)
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
console.log(props.post)
watchEffect(() => {
  posts.value = props.post
})
</script>
