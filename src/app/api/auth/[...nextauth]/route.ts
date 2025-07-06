import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

declare module 'next-auth' {
    interface Session {
        user: {
            firstName: string
            lastName: string
            email: string
            roleId: number
            isActive: boolean
            createdAt: string
            updatedAt: string
            role: string
        } & DefaultSession['user']
    }

    interface User {
        firstName: string
        lastName: string
        roleId: number
        isActive: boolean
        createdAt: string
        updatedAt: string
        role: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        firstName: string
        lastName: string
        roleId: number
        isActive: boolean
        createdAt: string
        updatedAt: string
        role: string
    }
}

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                const user = await prisma.user.findUnique({
                    where: { email: email },
                    include: {
                        role: true
                    }
                })


                if (!user) {
                    throw new Error("Usuario no encontrado")
                }

                if (!user.isActive) {
                    throw new Error("Cuenta inactiva. Contacta con el administrador.")
                }

                if (!bcrypt.compareSync(password, user.password)) return null

                return {
                    id: user.id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roleId: user.roleId,
                    isActive: user.isActive,
                    createdAt: user.createdAt.toISOString(),
                    updatedAt: user.updatedAt.toISOString(),
                    role: user.role.name
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName
                session.user.roleId = token.roleId
                session.user.isActive = token.isActive
                session.user.createdAt = token.createdAt
                session.user.updatedAt = token.updatedAt
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.roleId = user.roleId
                token.isActive = user.isActive
                token.createdAt = user.createdAt
                token.updatedAt = user.updatedAt
                token.role = user.role
            }
            return token
        },
    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/',
    },

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }