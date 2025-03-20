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
    <!-- Show skeleton while loading -->
    <BlogPostPreviewSkeleton v-if="loading" :count="6" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogPostPreview v-for="post in latestPosts" :key="post.id" :post="post" />
    </div>

    <div v-if="loading" class="flex justify-center"></div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import BlogPostPreviewSkeleton from '@/components/skeletons/BlogPostPreviewSkeleton.vue'

import { fetchPosts } from '@/services/api/blog'

const isAuthenticated = ref(!!localStorage.getItem('token'))

const loading = ref(true)

const latestPosts = ref([])

watchEffect(async () => {
  const posts = await fetchPosts()
  latestPosts.value = posts.posts
  loading.value = false
})
</script>
