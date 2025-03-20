<template>
  <div v-if="post" class="prose prose-lg max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-bold text-gray-900">{{ post.title }}</h1>
        <div v-if="isAuthor" class="flex space-x-4">
          <router-link :to="`/blog/edit/${post.id}`" class="text-indigo-600 hover:text-indigo-800">
            Edit
          </router-link>
          <button @click="handleDelete" class="text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex items-center text-gray-600 mb-8">
        <span>{{ formatDate(post.createdAt) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>

      <div class="prose prose-indigo max-w-none">
        <div v-html="parseMarkdown(post.content)"></div>
      </div>
    </div>
  </div>

  <BlogPostSkeleton v-else-if="loading" />

  <!-- Error state -->
  <div v-else class="max-w-4xl mx-auto p-8 text-center">
    <p class="text-red-600 text-xl">Failed to load post. Please try again later.</p>
    <router-link to="/blog" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
      Return to blog
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { formatDate } from '@/helpers/date'
import { parseMarkdown } from '@/helpers/markdown'
import { getPostById, deletePost } from '@/services/api/blog'
import BlogPostSkeleton from '@/components/skeletons/BlogPostSkeleton.vue'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const loading = ref(true)
const error = ref(null)
const { user } = await useAuth()

console.log(user)

const isAuthor = computed(() => user.value?.id === post.value?.authorId)
console.log('post', post.value)

onMounted(async () => {
  try {
    loading.value = true
    post.value = await getPostById(route.params.id)
  } catch (err) {
    console.error('Failed to load post:', err)
    error.value = err
  } finally {
    loading.value = false
  }
})


const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    await deletePost(route.params.id)
    router.push('/blog')
  }
}
</script>
