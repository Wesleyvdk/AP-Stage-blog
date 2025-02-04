<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <article v-else-if="post" class="bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Post Header -->
      <div class="p-6 border-b">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ post.title }}</h1>
        <div class="flex items-center justify-between text-gray-600">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <div class="flex gap-2">
            <span
              v-for="category in post.categories"
              :key="category"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ category }}
            </span>
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div class="prose prose-lg max-w-none p-6" v-html="sanitizedContent"></div>

      <!-- Post Footer -->
      <div class="p-6 border-t bg-gray-50">
        <router-link to="/blog" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Back to all posts
        </router-link>
      </div>
    </article>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
      <p class="text-red-800">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/solid'
import { getPostById } from '@/services/api/blog'
import { formatDate } from '@/helpers/date'
import { parseMarkdown, sanitizeHtml } from '@/helpers/markdown'

const route = useRoute()
const post = ref(null)
const isLoading = ref(true)
const error = ref(null)

const sanitizedContent = computed(() => {
  if (!post.value?.content) return ''
  const parsedContent = parseMarkdown(post.value.content)
  return sanitizeHtml(parsedContent)
})

onMounted(async () => {
  try {
    const postId = route.params.id
    post.value = await getPostById(postId)
  } catch (err) {
    error.value = 'Failed to load blog post'
    console.error('Error loading post:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
/* Add any additional styling for markdown content here */
.prose img {
  @apply rounded-lg shadow-md;
}

.prose pre {
  @apply bg-gray-800 text-white p-4 rounded-lg overflow-x-auto;
}

.prose code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
}

.prose blockquote {
  @apply border-l-4 border-gray-200 pl-4 italic;
}
</style>
