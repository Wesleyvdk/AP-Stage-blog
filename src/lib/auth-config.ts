import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
async function getUserWithAdmin(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/by-email/${encodeURIComponent(email)}`)
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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
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
              id: result.user.id.toString(),
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
      if (user) {
        token.userId = user.id
        token.isAdmin = user.isAdmin || false
      }
      if (account && (account.provider === "google" || account.provider === "github") && token.email) {
        const backendUser = await getUserWithAdmin(token.email)
        if (backendUser) {
          token.userId = backendUser.id.toString()
          token.isAdmin = backendUser.isAdmin || false
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.isAdmin = token.isAdmin as boolean
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
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
