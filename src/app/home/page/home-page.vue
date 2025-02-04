<template>
  <div>
    <h1 class="text-4xl font-bold mb-6">Welcome to My Portfolio</h1>
    <p class="mb-4">
      This website serves as a portfolio and blog for my internship experience. Here, you'll find
      information about my journey, the projects I'm working on, and my reflections on the learning
      process.
    </p>
    <h2 class="text-2xl font-semibold mb-4">Latest Blog Post</h2>
    <BlogPostPreview v-if="latestPost" :post="latestPost" />
    <p v-else class="text-gray-600">No blog posts available yet.</p>
    <router-link
      to="/blog"
      class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      View All Posts
    </router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import BlogPostPreview from '@/components/BlogPostPreview.vue'
import { getLatestBlogPost } from '@/services/blogService'

export default {
  components: {
    BlogPostPreview,
  },
  setup() {
    const latestPost = ref(null)

    onMounted(async () => {
      latestPost.value = await getLatestBlogPost()
    })

    return {
      latestPost,
    }
  },
}
</script>
