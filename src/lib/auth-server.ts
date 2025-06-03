import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Extract token from server-side context (cookies or headers)
export async function getServerToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    
    // Check for token in cookies first
    const tokenFromCookie = cookieStore.get('token')?.value;
    if (tokenFromCookie) {
      return tokenFromCookie;
    }

    return undefined;
  } catch (error) {
    console.error('Error getting server token:', error);
    return undefined;
  }
}

// Extract token from request headers
export function getTokenFromRequest(request: NextRequest): string | undefined {
  const authorization = request.headers.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7);
  }
  
  // Also check cookies
  const tokenFromCookie = request.cookies.get('token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return undefined;
}

// Check if user is authenticated on server side
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerToken();
  return !!token;
} 