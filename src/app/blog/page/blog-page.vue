<template>
  <div>
    <h1 class="text-4xl font-bold mb-6">Blog Posts</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Filter by Category:</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            @click="toggleCategory(category)"
            :class="[
              'px-3 py-1 rounded',
              selectedCategories.includes(category)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="space-y-8">
        <BlogPostPreview v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
    </div>
    <router-link
      v-if="isLoggedIn"
      to="/blog/new"
      class="mt-8 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Create New Post
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import { useBlogPosts } from '@/composables/useBlogPosts'
import { useAuth } from '@/composables/useAuth'

const { posts, isLoading, error, fetchPosts } = useBlogPosts()
const { isLoggedIn } = useAuth()

const categories = ref([])
const selectedCategories = ref([])

const filteredPosts = computed(() => {
  if (selectedCategories.value.length === 0) {
    return posts.value
  }
  return posts.value.filter((post) =>
    post.categories.some((category) => selectedCategories.value.includes(category)),
  )
})

const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

onMounted(async () => {
  await fetchPosts()
  categories.value = [...new Set(posts.value.flatMap((post) => post.categories))]
})
</script>
