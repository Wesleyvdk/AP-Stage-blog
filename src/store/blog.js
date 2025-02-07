import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPosts, createPost, getPostById } from '@/services/api/blog'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const getPost = async (id) => {
    isLoading.value = true
    try {
      posts.value = await getPostById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const getPosts = async () => {
    isLoading.value = true
    try {
      const response = await fetchPosts()
      posts.value = response
      return response
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
