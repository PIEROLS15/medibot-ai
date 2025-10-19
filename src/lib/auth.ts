import { NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

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

export const authOptions: NextAuthOptions = {
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
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
                    throw new Error('Usuario no encontrado')
                }

                if (!user.isActive) {
                    throw new Error('Cuenta inactiva. Contacta con el administrador.')
                }

                // Si el usuario se registró con Google y no tiene password
                if (!user.password || user.password === '') {
                    throw new Error('Esta cuenta fue creada con Google. Por favor, inicia sesión con Google.')
                }

                if (!bcrypt.compareSync(password, user.password)) {
                    throw new Error('Contraseña incorrecta')
                }

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

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {

            if (account?.provider === 'google') {

                const googleProfile = profile as GoogleProfile

                try {
                    const email = googleProfile.email
                    const googleId = account.providerAccountId

                    const existingUser = await prisma.user.findUnique({
                        where: { email },
                        include: { role: true }
                    })

                    if (existingUser) {
                        const updates: Prisma.UserUpdateInput = {}

                        if (!existingUser.googleId) {
                            updates.googleId = googleId
                        }

                        if (
                            googleProfile.given_name &&
                            googleProfile.given_name !== existingUser.firstName
                        ) {
                            updates.firstName = googleProfile.given_name
                        }

                        if (
                            googleProfile.family_name &&
                            googleProfile.family_name !== existingUser.lastName
                        ) {
                            updates.lastName = googleProfile.family_name
                        }
                        if (
                            googleProfile.picture &&
                            googleProfile.picture !== existingUser.profileImage
                        ) {
                            updates.profileImage = googleProfile.picture
                        }

                        if (Object.keys(updates).length > 0) {
                            await prisma.user.update({
                                where: { email },
                                data: updates,
                            })
                        }

                        if (!existingUser.isActive) {
                            throw new Error('Cuenta inactiva. Contacta con el administrador.')
                        }
                    }
                    else {

                        const defaultRole = await prisma.role.findFirst({
                            where: { name: 'Visitor' },
                        })

                        if (!defaultRole) {
                            throw new Error('Rol por defecto no encontrado')
                        }

                        await prisma.user.create({
                            data: {
                                email,
                                googleId,
                                firstName: googleProfile.given_name,
                                lastName: googleProfile.family_name,
                                roleId: defaultRole.id,
                                isActive: true,
                                profileImage: googleProfile.picture
                            },
                        })
                    }

                    return true
                } catch (error) {
                    console.error('Error en signIn con Google:', error)
                    return false
                }
            }

            return true
        },

        async jwt({ token, user, account }) {

            if (user) {
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.roleId = user.roleId
                token.isActive = user.isActive
                token.createdAt = user.createdAt
                token.updatedAt = user.updatedAt
                token.role = user.role
            }

            if (account?.provider === 'google' && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    include: { role: true },
                })

                if (dbUser) {
                    token.firstName = dbUser.firstName
                    token.lastName = dbUser.lastName
                    token.roleId = dbUser.roleId
                    token.isActive = dbUser.isActive
                    token.createdAt = dbUser.createdAt.toISOString()
                    token.updatedAt = dbUser.updatedAt.toISOString()
                    token.role = dbUser.role.name
                }
            }

            return token
        },

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
    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/',
    },
}
