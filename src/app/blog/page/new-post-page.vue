<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>

    <form @submit.prevent="showModal = true" class="space-y-6">
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
      <label for="content" class="block text-sm font-medium text-gray-700"
        >Content (Markdown)</label
      >
      <div class="space-y-4">
        <textarea
          id="content"
          v-model="form.content"
          @input="update"
          rows="10"
          required
          class="content mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
        <div class="output markdown-body prose" v-html="output"></div>
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
    <Modal :visible="showModal" :post="form" @cancel="showModal = false" @confirm="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { debounce } from 'lodash-es'
import createMarkdown from '@/compiler/markdown'
import Modal from '@/components/modal.vue'

const router = useRouter()

const loading = ref(false)
const form = ref({
  title: '',
  content: '',
  tags: [],
})
const showModal = ref(false)

const input = ref('')
const output = computed(() => createMarkdown(form.value.content))

const update = debounce((e) => {
  input.value = e.target.value
}, 100)

const handleSubmit = async () => {
  const { createPost } = await useBlog()
  loading.value = true
  try {
    if (!form.value.tags.length) {
      alert('Tags are required')
      return
    }
    await createPost(form.value)
    router.push('/blog')
  } catch (error) {
    console.error('Failed to create post:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.content,
.output {
  overflow: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.content {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}
</style>
