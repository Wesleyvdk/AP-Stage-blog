import { ref } from 'vue'
import { marked } from 'marked'

export function useBlogPosts() {
  const posts = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchPosts = async () => {
    isLoading.value = true
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      posts.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...postData,
          content: marked(postData.content),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      await fetchPosts()
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost,
  }
}
