<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Blog Posts</h1>
      <router-link
        v-if="isAuthenticated"
        to="/blog/new"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        New Post
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogPostPreview v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import { useBlog } from '@/composables/useBlog'
import { useAuth } from '@/composables/useAuth'

const { posts, loading, fetchPosts } = useBlog()
const { isAuthenticated } = useAuth()

onMounted(async () => {
  await fetchPosts()
})
</script>
