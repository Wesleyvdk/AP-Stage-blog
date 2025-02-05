<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="coverImage" class="block text-sm font-medium text-gray-700"
          >Cover Image URL</label
        >
        <input
          id="coverImage"
          v-model="form.coverImage"
          type="url"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium text-gray-700"
          >Content (Markdown)</label
        >
        <textarea
          id="content"
          v-model="form.content"
          rows="10"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-4">
        <router-link
          to="/blog"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating...' : 'Create Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlog } from '@/composables/useBlog'

const router = useRouter()

const loading = ref(false)
const form = ref({
  title: '',
  content: '',
  coverImage: '',
})

const handleSubmit = async () => {
  const { createPost } = await useBlog()
  loading.value = true
  try {
    await createPost(form.value)
    router.push('/blog')
  } catch (error) {
    console.error('Failed to create post:', error)
  } finally {
    loading.value = false
  }
}
</script>
