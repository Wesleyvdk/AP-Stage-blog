﻿"use client";
import { useState, useEffect } from "react";
import { api, getAllPostsForAdmin, type Post } from "./api-service";
import { useAuth } from "./auth-context";
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPostsForAdmin();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return { posts, isLoading, error };
}
export function usePublicPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return { posts, isLoading, error };
}
