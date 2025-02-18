<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <img
      :src="post.coverImage"
      :alt="post.title"
      class="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
    />

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

      <div class="flex items-center text-gray-600 mb-8">
        <span>{{ formatDate(posts.createdAt) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>

      <div class="prose prose-indigo max-w-none">
        <div v-html="parseMarkdown(posts.content)"></div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { useAuth } from '@/composables/useAuth'
import { formatDate } from '@/helpers/date'
import { parseMarkdown } from '@/helpers/markdown'

const route = useRoute()
const router = useRouter()
const { posts, loading, getPost, deletePost } = await useBlog()
const { user } = useAuth()

const isAuthor = computed(() => user.value?.id === post.value?.authorId)

onMounted(async () => {
  await getPost(route.params.id)
})

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    await deletePost(posts.value.id)
    router.push('/blog')
  }
}
</script>
