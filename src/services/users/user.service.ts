import bcrypt from 'bcryptjs'
import { RoleType } from '@prisma/client'
import prisma from '@/lib/prisma'

export type UserUpdateInput = {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    roleId?: number
    isActive?: boolean
}

const userWithRole = {
    include: {
        role: true,
    },
} as const

const userListSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    roleId: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
} as const

function stripPassword<T extends { password?: string | null }>(user: T) {
    const safeUser = { ...user }
    delete safeUser.password
    return safeUser
}

export async function listUsers() {
    const users = await prisma.user.findMany({
        include: { role: true },
        orderBy: { id: 'asc' },
    })

    return users.map(stripPassword)
}

export async function getUserById(id: number) {
    const user = await prisma.user.findUnique({
        where: { id },
        ...userWithRole,
    })

    if (!user) return null

    return stripPassword(user)
}

export async function updateUserById(id: number, input: UserUpdateInput) {
    const existingUser = await prisma.user.findUnique({
        where: { id },
    })

    if (!existingUser) {
        return null
    }

    if (input.email && input.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
            where: { email: input.email },
        })

        if (emailExists) {
            throw new Error('El email ya está en uso por otro usuario.')
        }
    }

    const updateData: UserUpdateInput = {}

    if (input.firstName) updateData.firstName = input.firstName
    if (input.lastName) updateData.lastName = input.lastName
    if (input.email) updateData.email = input.email
    if (input.roleId) updateData.roleId = input.roleId
    if (input.isActive !== undefined) updateData.isActive = input.isActive

    if (input.password) {
        updateData.password = await bcrypt.hash(input.password, 12)
    }

    return prisma.user.update({
        where: { id },
        data: updateData,
        select: userListSelect,
    })
}

export async function deleteUserById(id: number) {
    await prisma.user.delete({
        where: { id },
    })
}

export async function getRoleIdByName(name: RoleType) {
    const role = await prisma.role.findFirst({
        where: { name },
        select: { id: true },
    })

    return role?.id ?? null
}

export async function registerUser(input: {
    firstName: string
    lastName: string
    email: string
    password: string
    roleId: number
}) {
    const existingUser = await prisma.user.findFirst({ where: { email: input.email } })

    if (existingUser) {
        throw new Error('El correo ya está registrado')
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    return prisma.user.create({
        data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: hashedPassword,
            roleId: input.roleId,
            isActive: true,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            roleId: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    })
}
