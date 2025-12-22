import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "./db"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.warn('Missing credentials')
            return null
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(credentials.email)) {
            console.warn('Invalid email format')
            return null
          }

          // For demo purposes - create or find user
          // In production, implement proper password validation
          const user = await db.user.upsert({
            where: { email: credentials.email },
            update: {
              updatedAt: new Date(),
            },
            create: {
              email: credentials.email.toLowerCase().trim(),
              name: credentials.email.split('@')[0],
              emailVerified: new Date(),
            }
          })

          if (!user) {
            console.error('Failed to create/find user')
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session: async ({ token, session }) => {
      if (token?.id) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
    jwt: async ({ user, token, account }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut({ token }) {
      console.log(`User signed out`)
    },
    async session({ session, token }) {
      // You can log session activity here
    },
  },
  debug: process.env.NODE_ENV === 'development',
}