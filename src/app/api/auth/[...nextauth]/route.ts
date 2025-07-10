import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

// Helper function to get user with admin status from your backend
async function getUserWithAdmin(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/by-email/${email}`)
    if (response.ok) {
      const user = await response.json()
      return user
    }
  } catch (error) {
    console.error("Error fetching user admin status:", error)
  }
  return null
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your existing API endpoint for credentials login
          const response = await fetch(`${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const result = await response.json()
          
          if (result && result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              isAdmin: result.user.isAdmin || false,
            }
          }

          return null
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // When user signs in, add their info to the token
      if (user) {
        token.userId = user.id
        token.isAdmin = user.isAdmin || false
      }
      
      // For OAuth sign-ins, fetch admin status from backend
      if (account && (account.provider === "google" || account.provider === "github") && token.email) {
        const backendUser = await getUserWithAdmin(token.email)
        if (backendUser) {
          token.userId = backendUser.id
          token.isAdmin = backendUser.isAdmin || false
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.isAdmin = token.isAdmin as boolean
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, create/update user in your database
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Call your backend to create/update OAuth user
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth-signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              provider: account.provider,
            }),
          })
          
          if (!response.ok) {
            console.error("Failed to create/update OAuth user")
            return false
          }
          
          return true
        } catch (error) {
          console.error("Error during OAuth sign-in:", error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 