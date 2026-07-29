import './types'

import type { NextAuthOptions } from 'next-auth'
import { credentialsProvider } from './credentials'
import { googleProvider } from './google'
import { authCallbacks } from './callbacks'

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [credentialsProvider, googleProvider],
    callbacks: authCallbacks,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
    },
}
