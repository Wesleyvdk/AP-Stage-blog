<template>
  <div class="space-y-12">
    <section class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Blog AP</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Discover insights, tutorials, and the latest trends in web development and technology.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Featured Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostPreview v-for="post in featuredPosts" :key="post.id" :post="post" />
      </div>
    </section>

    <section class="bg-gray-100 py-12 px-4 rounded-lg">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
        <p class="text-xl text-gray-600 mb-8">
          Get access to exclusive content, interact with other developers, and stay up-to-date with
          the latest in tech.
        </p>
        <router-link
          to="/auth/login"
          class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Sign Up Now
        </router-link>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Latest Posts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostPreview v-for="post in latestPosts" :key="post.id" :post="post" />
      </div>
      <div class="text-center mt-8">
        <router-link
          to="/blog"
          class="inline-block bg-white text-indigo-600 px-6 py-3 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          View All Posts
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import { useBlog } from '@/composables/useBlog'

const { fetchPosts } = useBlog()

const featuredPosts = ref([])
const latestPosts = ref([])

onMounted(async () => {
  const posts = await fetchPosts()
  featuredPosts.value = posts.filter((post) => post.featured).slice(0, 3)
  latestPosts.value = posts.slice(0, 6)
})
</script>
