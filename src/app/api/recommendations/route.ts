import { NextResponse } from 'next/server'
import {
    RecommendationPayload,
} from '@/types/recommendation.backend'
import { listRecommendations, storeRecommendation } from '@/services/recommendations/recommendation.service'


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const userId = searchParams.get('userId')
        const dni = searchParams.get('dni')
        const ruc = searchParams.get('ruc')

        const result = await listRecommendations({ id, userId, dni, ruc })

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del servidor'
        const status = message.startsWith('No se encontró la recomendación') ? 404 : 500
        return NextResponse.json(
            { error: message, details: String(error) },
            { status }
        )
    }
}

export async function POST(req: Request) {
    try {

        const body: RecommendationPayload = await req.json()
        const { userId, form, recommendationResult } = body

        if (!userId || !form || !form.idNumber || !form.fullName) {
            return NextResponse.json({ error: 'Datos insuficientes' }, { status: 400 })
        }

        const recommendation = await storeRecommendation({
            userId,
            form,
            recommendationResult,
        })

        return NextResponse.json(
            {
                message: 'Recomendación almacenada exitosamente',
                recommendation,
            },
            { status: 201 }
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error interno del servidor'
        const status = message.startsWith('Usuario con ID') ? 404 : 500
        return NextResponse.json(
            { error: message, details: String(error) },
            { status }
        )
    }
}
