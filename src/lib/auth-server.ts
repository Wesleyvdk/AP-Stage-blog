import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

// Get the current user session server-side using NextAuth
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    // If we have session but no isAdmin info, fetch it from backend
    if (session.user && typeof session.user.isAdmin === 'undefined') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/by-email/${encodeURIComponent(session.user.email)}`);
        if (response.ok) {
          const backendUser = await response.json();
          return {
            id: session.user.id || backendUser.id.toString(),
            email: session.user.email,
            name: session.user.name || backendUser.name,
            isAdmin: backendUser.isAdmin || false,
          };
        } else {
          console.warn(`Failed to fetch user from backend: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user from backend:", error);
      }
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || null,
      isAdmin: session.user.isAdmin || false,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Require admin access
export async function requireAdmin(): Promise<AuthUser | Response> {
  const user = await getCurrentUser();
  
  if (!user) {
    return Response.json(
      { error: "Authentication required. Please log in." }, 
      { status: 401 }
    );
  }
  
  if (!user.isAdmin) {
    return Response.json(
      { error: "Admin access required. You don't have permission to perform this action." }, 
      { status: 403 }
    );
  }
  
  return user;
}

// Require any authenticated user
export async function requireAuth(): Promise<AuthUser | Response> {
  const user = await getCurrentUser();
  
  if (!user) {
    return Response.json(
      { error: "Authentication required. Please log in." }, 
      { status: 401 }
    );
  }
  
  return user;
}

// Legacy function for backward compatibility
export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// Check if user is authenticated on server side (legacy)
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
} 