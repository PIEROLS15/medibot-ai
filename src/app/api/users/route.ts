import { NextResponse } from 'next/server'
import { listUsers } from '@/services/users/user.service'

export async function GET() {
    try {
        const users = await listUsers()
        return NextResponse.json(users, { status: 200 })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al obtener los usuarios', details: (error as Error).message },
            { status: 500 }
        )
    }
}
