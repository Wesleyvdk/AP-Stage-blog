<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Your Posts</h2>
        <p class="text-3xl font-bold text-indigo-600">{{ userPosts.length }}</p>
        <router-link to="/blog" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          View all posts →
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Total Views</h2>
        <p class="text-3xl font-bold text-indigo-600">{{ totalViews }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Latest Comments</h2>
        <ul class="space-y-2">
          <li v-for="comment in latestComments" :key="comment.id" class="text-gray-600">
            {{ comment.text.substring(0, 50) }}...
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Recent Posts</h2>
      <div class="space-y-4">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0"
        >
          <div>
            <h3 class="text-lg font-medium text-gray-800">{{ post.title }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
          </div>
          <router-link :to="`/blog/${post.id}`" class="text-indigo-600 hover:text-indigo-800">
            View
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBlog } from '@/composables/useBlog'
import { formatDate } from '@/helpers/date'

const { fetchUserPosts } = useBlog()

const userPosts = ref([])
const totalViews = ref(0)
const latestComments = ref([])
const recentPosts = ref([])

onMounted(async () => {
  userPosts.value = await fetchUserPosts()
  totalViews.value = userPosts.value.reduce((sum, post) => sum + post.views, 0)

  // Simulated data for latest comments and recent posts
  latestComments.value = [
    { id: 1, text: 'Great post! Very informative.' },
    { id: 2, text: 'I learned a lot from this. Thanks!' },
    { id: 3, text: 'Looking forward to more content like this.' },
  ]

  recentPosts.value = userPosts.value.slice(0, 5)
})
</script>
