import { client } from '../client'

export const fetchPosts = async () => {
  const response = await client.get('http://localhost:3001/api/posts')
  return response.data
}

export const createPost = async (postData) => {
  const response = await client.post('http://localhost:3001/api/post', postData)
  return response.data
}

export const getPostById = async (id) => {
  const response = await client.get(`http://localhost:3001/api/post/${id}`)
  return response.data
}
