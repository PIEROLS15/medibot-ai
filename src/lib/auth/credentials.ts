import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const credentialsProvider = CredentialsProvider({
    credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        })

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        if (!user.isActive) {
            throw new Error('Cuenta inactiva. Contacta con el administrador.')
        }

        if (!user.password) {
            throw new Error('Esta cuenta fue creada con Google. Por favor, inicia sesión con Google.')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
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
            role: user.role.name,
        }
    },
})
