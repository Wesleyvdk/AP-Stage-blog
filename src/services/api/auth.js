import { client } from '../client'

export const loginUser = async (email, password) => {
  const response = await client.post(`${import.meta.env.VITE_API_URL}/api/login`, {
    email,
    password,
  })
  return response.data
}

export const logoutUser = async () => {
  const response = await client.post('/api/logout')
  return response.data
}
