import { useBlogStore } from '@/store/blog'
import { storeToRefs } from 'pinia'

export const useBlog = async () => {
  const store = await useBlogStore()
  const { posts, isLoading, error } = storeToRefs(store)

  return {
    posts,
    isLoading,
    error,
    getPost: store.getPosts,
    createPost: store.addPost,
  }
}
