import { client } from '../client'

export const fetchPosts = async () => {
  const response = await client.get(`${import.meta.env.VITE_API_URL}/api/posts`)
  console.log('response in api/blog/fetchPosts', response)
  return response.data
}

export const createPost = async (postData) => {
  const response = await client.post(`${import.meta.env.VITE_API_URL}/api/post`, postData)
  return response.data
}

export const getPostById = async (id) => {
  const response = await client.get(`${import.meta.env.VITE_API_URL}/api/post/${id}`)
  return response.data
}

export const deletePost = async (id) => {
  const response = await client.delete(`${import.meta.env.VITE_API_URL}/api/post/${id}`)
  return response.data
}
