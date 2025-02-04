<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <div class="mb-6">
              <h2 class="text-2xl font-bold mb-4">Create New Blog Post</h2>
              <router-link
                to="/blog/new"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon class="h-5 w-5 mr-2" />
                New Post
              </router-link>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4">Recent Posts</h2>
              <div v-if="isLoading">Loading...</div>
              <div v-else-if="error">{{ error }}</div>
              <div v-else class="space-y-4">
                <div
                  v-for="post in recentPosts"
                  :key="post.id"
                  class="bg-white shadow rounded-lg p-4"
                >
                  <h3 class="text-lg font-semibold">{{ post.title }}</h3>
                  <p class="text-gray-500 text-sm">{{ formatDate(post.date) }}</p>
                  <div class="mt-2 flex gap-2">
                    <span
                      v-for="category in post.categories"
                      :key="category"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {{ category }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/solid'
import { useBlogPosts } from '@/composables/useBlogPosts'

const { posts, isLoading, error, fetchPosts } = useBlogPosts()

const recentPosts = computed(() => {
  return posts.value.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchPosts()
})
</script>
