// API service for interacting with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  tags: string[];
  published?: boolean;
  views?: number;
  category?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Helper function to check if user is authenticated (client-side)
function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

// Helper function for server-side authentication check
function isServerAuthenticated(token?: string): boolean {
  return !!token;
}

// Helper function for API requests
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Helper function for server-side API requests with optional token
async function fetchServerAPI<T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// API functions
export const api = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchAPI<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Posts - Admin only (gets all posts including drafts)
  getAllPosts: async (): Promise<Post[]> => {
    const response = await fetchAPI<{ posts: any[] }>("/api/posts");
    const sortedRawPosts = response.posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sortedRawPosts.map((post) => ({
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
      category: post.category,
    }));
  },

  // Posts - Public only (gets published posts only)
  getPosts: async (): Promise<Post[]> => {
    const response = await fetchAPI<{ posts: any[] }>("/api/posts");
    const sortedRawPosts = response.posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    
    // Filter to only include published posts unless user is authenticated
    const filteredPosts = isAuthenticated() 
      ? sortedRawPosts 
      : sortedRawPosts.filter(post => post.published === true);
    
    return filteredPosts.map((post) => ({
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
      category: post.category,
    }));
  },

  getFeed: async (): Promise<Post[]> => {
    return fetchAPI<Post[]>("/api/feed");
  },

  getPost: async (id: string): Promise<Post> => {
    const post = await fetchAPI<Post>(`/api/post/${id}`);
    
    // If post is not published and user is not authenticated, throw error
    if (!post.published && !isAuthenticated()) {
      throw new Error("Post not found or not accessible");
    }
    
    return post;
  },

  createPost: async (post: Omit<Post, "id" | "date">): Promise<Post> => {
    return fetchAPI<Post>("/api/post", {
      method: "POST",
      body: JSON.stringify(post),
    });
  },

  deletePost: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/post/${id}`, {
      method: "DELETE",
    });
  },

  updatePost: async (
    id: string,
    post: Omit<Post, "id" | "date">,
  ): Promise<Post> => {
    return fetchAPI<Post>(`/api/post/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    });
  },

  // Views
  incrementViews: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/post/${id}/views`, {
      method: "PUT",
    });
  },

  // Publishing
  publishPost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/api/publish/${id}`, {
      method: "PUT",
    });
  },
};

// Server-side API functions
export const serverApi = {
  // Get post by ID on server side with optional authentication
  getPost: async (id: string, token?: string): Promise<Post> => {
    const post = await fetchServerAPI<Post>(`/api/post/${id}`, token);
    
    // If post is not published and user is not authenticated, throw error
    if (!post.published && !isServerAuthenticated(token)) {
      throw new Error("Post not found or not accessible");
    }
    
    return post;
  },

  // Get posts on server side with optional authentication  
  getPosts: async (token?: string): Promise<Post[]> => {
    const response = await fetchServerAPI<{ posts: any[] }>("/api/posts", token);
    const sortedRawPosts = response.posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    
    // Filter to only include published posts unless user is authenticated
    const filteredPosts = isServerAuthenticated(token) 
      ? sortedRawPosts 
      : sortedRawPosts.filter(post => post.published === true);
    
    return filteredPosts.map((post) => ({
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
      category: post.category,
    }));
  },
};

export async function getPostById(id: string, token?: string): Promise<Post | undefined> {
  try {
    // Use server API if we have a token parameter, otherwise use client API
    if (typeof window === "undefined" || token !== undefined) {
      return await serverApi.getPost(id, token);
    } else {
      return await api.getPost(id);
    }
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return undefined;
  }
}

export async function getAllPosts(limit?: number, token?: string): Promise<Post[]> {
  try {
    // Use server API if we have a token parameter, otherwise use client API
    let posts: Post[];
    if (typeof window === "undefined" || token !== undefined) {
      posts = await serverApi.getPosts(token);
    } else {
      posts = await api.getPosts();
    }
    
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return limit ? sortedPosts.slice(0, limit) : sortedPosts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

// Admin-only function to get all posts including drafts
export async function getAllPostsForAdmin(limit?: number): Promise<Post[]> {
  try {
    const posts = await api.getAllPosts();
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return limit ? sortedPosts.slice(0, limit) : sortedPosts;
  } catch (error) {
    console.error("Error fetching all posts for admin:", error);
    return [];
  }
}
