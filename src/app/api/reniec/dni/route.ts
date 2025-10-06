import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const numero = searchParams.get('numero')
        if (!numero) {
            return NextResponse.json({ error: 'Falta numero' }, { status: 400 })
        }

        const token = process.env.RENIEC_TOKEN
        if (!token) {
            return NextResponse.json({ error: 'Falta RENIEC_TOKEN' }, { status: 500 })
        }

        const api_dni = process.env.NEXT_PUBLIC_API_RENIEC_DNI

        const upstream = await fetch(`${api_dni}${numero}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!upstream.ok) {
            const text = await upstream.text()
            return NextResponse.json({ error: text || 'Error en upstream' }, { status: upstream.status })
        }

        const data = await upstream.json()
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Error inesperado', details: (error as Error).message }, { status: 500 })
    }
}
