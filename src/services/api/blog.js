import { client } from '../client'

export const fetchPosts = async () => {
  const response = await client.get('/api/posts')
  return response.data
}

export const createPost = async (postData) => {
  const response = await client.post('/api/posts', postData)
  return response.data
}

export const getPostById = async (id) => {
  const response = await client.get(`/api/posts/${id}`)
  return response.data
}
