<template>
  <div v-if="post" class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-bold text-gray-900">{{ post.title }}</h1>
        <div v-if="isAuthor" class="flex space-x-4">
          <router-link :to="`/blog/edit/${post.id}`" class="text-indigo-600 hover:text-indigo-800">
            Edit
          </router-link>
          <button @click="handleDelete" class="text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex items-center text-gray-600 mb-8">
        <span>{{ formatDate(post.createdAt) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>

      <div class="prose prose-indigo max-w-none">
        <div v-html="parseMarkdown(post.content)"></div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { formatDate } from '@/helpers/date'
import { parseMarkdown } from '@/helpers/markdown'
import { getPostById } from '@/services/api/blog'

const route = useRoute()
const router = useRouter()
const post = ref(await getPostById(route.params.id))
const { user } = await useAuth()

console.log(user)

const isAuthor = computed(() => user.value?.id === post.value?.authorId)
console.log('post', post.value)

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this post?')) {
    await deletePost(posts.value.id)
    router.push('/blog')
  }
}
</script>
