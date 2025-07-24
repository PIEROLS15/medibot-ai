import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params

    try {
        const userWithPassword = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                role: true
            }
        })

        if (!userWithPassword) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = userWithPassword

        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los usuarios', details: (error as Error).message },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {

    const session = await getServerSession(authOptions)

    if (!session || session.user.roleId !== 1) {
        return NextResponse.json(
            { error: 'No autorizado. Solo los administradores pueden modificar el rol del usuario.' },
            { status: 403 }
        )
    }

    const { id } = await context.params
    const body = await request.json()
    const { firstName, lastName, email, password, roleId, isActive } = body

    if (!firstName && !lastName && !email && !password && !roleId && isActive === undefined) {
        return NextResponse.json(
            { error: 'Debe proporcionar al menos un campo para actualizar.' },
            { status: 400 }
        )
    }

    try {

        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado.' },
                { status: 404 }
            )
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email }
            })

            if (emailExists) {
                return NextResponse.json(
                    { error: 'El email ya está en uso por otro usuario.' },
                    { status: 400 }
                )
            }
        }

        const updateData: {
            firstName?: string
            lastName?: string
            email?: string
            password?: string
            roleId?: number
            isActive?: boolean
        } = {}

        if (firstName) updateData.firstName = firstName
        if (lastName) updateData.lastName = lastName
        if (email) updateData.email = email
        if (roleId) updateData.roleId = parseInt(roleId, 10)
        if (isActive !== undefined) updateData.isActive = isActive

        if (password) {
            const saltRounds = 12
            updateData.password = await bcrypt.hash(password, saltRounds)
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roleId: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json(
            { message: 'Rol actualizado correctamente', user: updatedUser },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al actualizar el rol del usuario', details: error },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}


export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params

    try {
        const userId = Number(id)

        await prisma.user.delete({
            where: { id: userId },
        })

        return NextResponse.json(
            { message: 'Usuario eliminado correctamente' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al eliminar al usuario', details: error },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 })
}