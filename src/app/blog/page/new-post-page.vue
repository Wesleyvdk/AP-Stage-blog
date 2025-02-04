<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Create New Blog Post</h1>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block mb-1">Title</label>
        <input
          type="text"
          id="title"
          v-model="title"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label for="content" class="block mb-1">Content (Markdown)</label>
        <textarea
          id="content"
          v-model="content"
          required
          rows="10"
          class="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>
      <div>
        <label for="categories" class="block mb-1">Categories (comma-separated)</label>
        <input
          type="text"
          id="categories"
          v-model="categoriesInput"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Create Post
      </button>
    </form>
    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogPosts } from '@/composables/useBlogPosts'

const router = useRouter()
const { createPost } = useBlogPosts()

const title = ref('')
const content = ref('')
const categoriesInput = ref('')
const error = ref('')

const handleSubmit = async () => {
  try {
    const categories = categoriesInput.value
      .split(',')
      .map((cat) => cat.trim())
      .filter(Boolean)
    await createPost({
      title: title.value,
      content: content.value,
      categories,
      date: new Date().toISOString(),
    })
    router.push('/blog')
  } catch (err) {
    error.value = 'Failed to create post'
  }
}
</script>
