import type { Account, Profile, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { GoogleProfile } from 'next-auth/providers/google'
import { loadGoogleUser, syncGoogleUser } from './google'

type CallbackUser = {
    id: string | number
    firstName: string
    lastName: string
    roleId: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    role: string
    email?: string | null
}

function populateTokenFromUser(token: JWT, user: CallbackUser) {
    token.id = Number(user.id)
    token.firstName = user.firstName
    token.lastName = user.lastName
    token.roleId = user.roleId
    token.isActive = user.isActive
    token.createdAt = user.createdAt
    token.updatedAt = user.updatedAt
    token.role = user.role
    token.email = user.email ?? token.email
}

export const authCallbacks = {
    async signIn({ account, profile }: { account: Account | null; profile?: Profile }) {
        if (account?.provider !== 'google') return true

        if (!profile) return false

        await syncGoogleUser(profile as GoogleProfile, account.providerAccountId)
        return true
    },
    async jwt({ token, user, account }: { token: JWT; user?: CallbackUser; account?: Account | null }) {
        if (user) {
            populateTokenFromUser(token, user)
        }

        if (account?.provider === 'google') {
            const email = token.email || user?.email

            if (email) {
                const dbUser = await loadGoogleUser(email)
                if (dbUser) {
                    populateTokenFromUser(token, dbUser)
                }
            }
        }

        return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
        if (session.user) {
            session.user.id = Number(token.id)
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
}
