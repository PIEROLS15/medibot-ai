import { NextRequest, NextResponse } from "next/server"
import { getRoleIdByName, registerUser } from "@/services/users/user.service"
import { z } from 'zod'

const registerInputSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = registerInputSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Datos inválidos', errors: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { firstName, lastName, email, password } = parsed.data

        const roleId = await getRoleIdByName('Visitor')

        if (!roleId) {
            return NextResponse.json({ message: 'Rol por defecto no encontrado' }, { status: 500 })
        }

        const newUser = await registerUser({
            firstName,
            lastName,
            email,
            password,
            roleId,
        })

        return NextResponse.json({ message: "Usuario registrado con éxito", user: newUser }, { status: 201 })

    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno del servidor"
        const status = message === 'El correo ya está registrado' ? 400 : 500
        return NextResponse.json({ message }, { status })
    }
}
