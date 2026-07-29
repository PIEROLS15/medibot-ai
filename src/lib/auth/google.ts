import type { Prisma } from '@prisma/client'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import prisma from '@/lib/prisma'
import type { AuthUser } from './types'

export const googleProvider = GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
})

export async function syncGoogleUser(profile: GoogleProfile, providerAccountId: string) {
    const email = profile.email
    const googleId = providerAccountId
    const firstName = profile.given_name ?? profile.name?.split(' ')?.[0] ?? ''
    const lastName = profile.family_name ?? profile.name?.split(' ')?.slice(1).join(' ') ?? ''

    const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
    })

    if (existingUser) {
        const updates: Prisma.UserUpdateInput = {}

        if (!existingUser.googleId) {
            updates.googleId = googleId
        }

        if (firstName && firstName !== existingUser.firstName) {
            updates.firstName = firstName
        }

        if (lastName && lastName !== existingUser.lastName) {
            updates.lastName = lastName
        }

        if (profile.picture && profile.picture !== existingUser.profileImage) {
            updates.profileImage = profile.picture
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

        return existingUser.role.name
    }

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
            firstName,
            lastName,
            roleId: defaultRole.id,
            isActive: true,
            profileImage: profile.picture,
        },
    })

    return defaultRole.name
}

export async function loadGoogleUser(email: string): Promise<AuthUser | null> {
    const dbUser = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
    })

    if (!dbUser) return null

    return {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        roleId: dbUser.roleId,
        isActive: dbUser.isActive,
        createdAt: dbUser.createdAt.toISOString(),
        updatedAt: dbUser.updatedAt.toISOString(),
        role: dbUser.role.name,
    }
}
