import { getSession } from "next-auth/react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  date: string;
  createdAt: string;
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
function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}
function isServerAuthenticated(token?: string): boolean {
  return !!token;
}
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let authHeaders: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const session = await getSession();
      if (session?.user?.email) {
        authHeaders["x-user-email"] = session.user.email;
      }
      if (session?.user?.id) {
        authHeaders["x-user-id"] = session.user.id;
      }
    } catch (error) {
      console.error("Error getting session for API call:", error);
    }
  }
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...authHeaders,
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
async function fetchServerAPI<T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {},
  userEmail?: string,
  userId?: string,
): Promise<T> {
  const authHeaders: Record<string, string> = {};
  if (userEmail) {
    authHeaders["x-user-email"] = userEmail;
  }
  if (userId) {
    authHeaders["x-user-id"] = userId;
  }
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...authHeaders,
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
export const api = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchAPI<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
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
  getPosts: async (): Promise<Post[]> => {
    const response = await fetchAPI<{ posts: any[] }>("/api/posts");
    const sortedRawPosts = response.posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
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
  incrementViews: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/api/post/${id}/views`, {
      method: "PUT",
    });
  },
  publishPost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/api/publish/${id}`, {
      method: "PUT",
    });
  },
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await fetchAPI<{ comments: any[] }>(`/api/post/${postId}/comments`);
    return response.comments.map((comment) => ({
      id: comment.id.toString(),
      postId: comment.postId.toString(),
      author: comment.author,
      email: comment.email,
      content: comment.content,
      date: new Date(comment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: comment.createdAt,
    }));
  },
  createComment: async (comment: {
    postId: string;
    author: string;
    email: string;
    content: string;
  }): Promise<Comment> => {
    const newComment = await fetchAPI<any>(`/api/post/${comment.postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
    });
    return {
      id: newComment.id.toString(),
      postId: newComment.postId.toString(),
      author: newComment.author,
      email: newComment.email,
      content: newComment.content,
      date: new Date(newComment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: newComment.createdAt,
    };
  },
  deleteComment: async (commentId: string): Promise<void> => {
    return fetchAPI<void>(`/api/comment/${commentId}`, {
      method: "DELETE",
    });
  },
};
export const serverApi = {
  getPost: async (id: string, token?: string): Promise<Post> => {
    const post = await fetchServerAPI<Post>(`/api/post/${id}`, token);
    if (!post.published && !isServerAuthenticated(token)) {
      throw new Error("Post not found or not accessible");
    }
    return post;
  },
  getPosts: async (token?: string): Promise<Post[]> => {
    const response = await fetchServerAPI<{ posts: any[] }>("/api/posts", token);
    const sortedRawPosts = response.posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
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
