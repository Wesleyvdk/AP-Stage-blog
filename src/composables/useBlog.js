import { useBlogStore } from '@/store/blog'
import { storeToRefs } from 'pinia'

export function useBlog() {
  const store = useBlogStore()
  const { posts, isLoading, error } = storeToRefs(store)

  return {
    posts,
    isLoading,
    error,
    getPosts: store.getPosts,
    addPost: store.addPost,
  }
}
