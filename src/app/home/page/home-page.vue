<template>
  <div class="space-y-12">
    <HomeInfo />
    <section>
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Recente Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostPreview v-for="post in latestPosts" :key="post.id" :post="post" />
      </div>
      <div class="text-center mt-8">
        <router-link
          to="/blog"
          class="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          Bekijke Alle Posts
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import HomeInfo from '@/components/HomeInfo.vue'
import { fetchPosts } from '@/services/api/blog'

const latestPosts = ref([])

watchEffect(async () => {
  const posts = await fetchPosts()
  latestPosts.value = posts
})
</script>
