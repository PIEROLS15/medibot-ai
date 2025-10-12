import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, email, password } = await req.json()

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ message: "El correo ya está registrado" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const assignedRoleId = 3

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                roleId: assignedRoleId,
                isActive: true
            },
        })

        return NextResponse.json({ message: "Usuario registrado con éxito", user: newUser }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function GET() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 })
}

export async function PUT() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 })
}

export async function DELETE() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 })
}
