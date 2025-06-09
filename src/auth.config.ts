import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

                if (!user) return null

                if (!bcrypt.compareSync(password, user.password)) return null

                const userAu = {
                    id: user.id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roleId: user.roleId,
                    isActive: user.isActive,
                }

                return userAu
            },
        }),
    ]
}

export const { signIn, signOut, auth } = NextAuth(authConfig)