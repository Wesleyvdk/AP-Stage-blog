// API service for interacting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Types
export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  date: string
  tags: string[]
  published?: boolean
  views?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// API functions
export const api = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchAPI<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    const response = await fetchAPI<{ posts: any[] }>("/api/posts")
    return response.posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      content: post.content,
      excerpt: post.content.substring(0, 150) + "...",
      date: new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      tags: post.tags || [],
      published: post.published,
      views: post.viewCount,
    }))
  },

  getFeed: async (): Promise<Post[]> => {
    return fetchAPI<Post[]>("/api/feed")
  },

  getPost: async (id: string): Promise<Post> => {
   return fetchAPI<Post>(`/api/post/${id}`)
  },

  createPost: async (post: Omit<Post, "id" | "date">): Promise<Post> => {
    return fetchAPI<Post>("/api/post", {
      method: "POST",
      body: JSON.stringify(post),
    })
  },

  deletePost: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/post/${id}`, {
      method: "DELETE",
    })
  },

  // Views
  incrementViews: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/post/${id}/views`, {
      method: "PUT",
    })
  },

  // Publishing
  publishPost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/api/publish/${id}`, {
      method: "PUT",
    })
  },
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    return await api.getPost(id)
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error)
    return undefined
  }
}

export async function getAllPosts(limit?: number): Promise<Post[]> {
  try {
    const posts = await api.getPosts()
    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return limit ? sortedPosts.slice(0, limit) : sortedPosts
  } catch (error) {
    console.error("Error fetching all posts:", error)
    return []
  }
}

