import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = credentialsSchema.safeParse(credentials)
          if (!parsedCredentials.success) {
            console.error("[AUTH] Invalid credentials format:", parsedCredentials.error)
            return null
          }

          const { email, password } = parsedCredentials.data
          console.log("[AUTH] Authorizing user:", email)
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            console.log("[AUTH] User not found or no password set")
            return null
          }

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) {
            console.log("[AUTH] Password match for:", email)
            return { id: user.id, email: user.email, name: user.name }
          }

          console.log("[AUTH] Password mismatch for:", email)
          return null
        } catch (error) {
          console.error("[AUTH] Error during authorize:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
