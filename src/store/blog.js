import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPosts, createPost } from '@/services/api/blog'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const getPosts = async () => {
    isLoading.value = true
    try {
      posts.value = await fetchPosts()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const addPost = async (postData) => {
    try {
      await createPost(postData)
      await getPosts()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    posts,
    isLoading,
    error,
    getPosts,
    addPost,
  }
})
