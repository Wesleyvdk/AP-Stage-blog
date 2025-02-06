import { useBlogStore } from '@/store/blog'
import { storeToRefs } from 'pinia'

export async function useBlog() {
  const store = await useBlogStore()
  const { posts, isLoading, error } = storeToRefs(store)

  return {
    posts,
    isLoading,
    error,
    getPosts: store.getPosts,
    getPost: store.getPost,
    createPost: store.addPost,
  }
}
