import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteUserById, getUserById, updateUserById } from '@/services/users/user.service'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params

    try {
        const user = await getUserById(parseInt(id, 10))

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del servidor'
        return NextResponse.json(
            { error: 'Error al obtener el usuario', details: message },
            { status: 500 }
        )
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
        const updatedUser = await updateUserById(parseInt(id, 10), {
            firstName,
            lastName,
            email,
            password,
            roleId: roleId ? parseInt(roleId, 10) : undefined,
            isActive,
        })

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado.' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: 'Usuario actualizado correctamente', user: updatedUser },
            { status: 200 }
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del servidor'
        const status = message.includes('email ya está en uso') ? 400 : 500
        return NextResponse.json(
            { error: 'Error al actualizar el usuario', details: message },
            { status }
        )
    }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {

    const session = await getServerSession(authOptions)

    if (!session || session.user.roleId !== 1) {
        return NextResponse.json(
            { error: 'No autorizado. Solo los administradores pueden eliminar usuarios.' },
            { status: 403 }
        )
    }

    const { id } = await context.params

    try {
        const userId = Number(id)

        await deleteUserById(userId)

        return NextResponse.json(
            { message: 'Usuario eliminado correctamente' },
            { status: 200 }
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del servidor'
        return NextResponse.json(
            { error: 'Error al eliminar al usuario', details: message },
            { status: 500 }
        )
    }
}
