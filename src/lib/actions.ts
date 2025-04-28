"use server"

import { api } from "./api-service"

export async function incrementViewCount(postId: string) {
  try {
    await api.incrementViews(postId)
    return { success: true }
  } catch (error) {
    console.error("Failed to increment view count:", error)
    return { success: false, error: "Failed to increment view count" }
  }
}
