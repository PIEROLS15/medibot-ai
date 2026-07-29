import type { DefaultSession } from 'next-auth'

export interface AuthUser {
    id: number
    firstName: string
    lastName: string
    email: string
    roleId: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    role: string
}

declare module 'next-auth' {
    interface Session {
        user: AuthUser & DefaultSession['user']
    }

    interface User {
        id: string
        firstName: string
        lastName: string
        email: string
        roleId: number
        isActive: boolean
        createdAt: string
        updatedAt: string
        role: string
        name?: string | null
        image?: string | null
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends AuthUser {
        name?: string | null
        email?: string | null
        picture?: string | null
        sub?: string
    }
}
