import { NextResponse, NextRequest } from 'next/server'
import { buildMedicalPrompt } from '@/lib/prompt'
import { validateMedicalInput, validateMedicalResponse, safeJson, medicalResponseSchema } from '@/utils/recommendation'
import { MedicalResponse } from '@/types/recommendation'

const GEMINI_URL = process.env.GEMINI_URL

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        validateMedicalInput(body)

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Falta GEMINI_API_KEY en el servidor.' },
                { status: 500 }
            )
        }

        const prompt = buildMedicalPrompt(body)

        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 768,
                    temperature: 0.2,
                    responseMimeType: 'application/json',
                    responseSchema: medicalResponseSchema
                }
            })
        })

        if (!response.ok) {
            const error = await safeJson(response)
            return NextResponse.json(
                { error: 'Gemini API error', status: response.status, details: error },
                { status: response.status }
            )
        }

        const data = await response.json()
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            return NextResponse.json(
                { error: 'Respuesta no-JSON del modelo', raw },
                { status: 502 }
            )
        }

        let medicalResponse: MedicalResponse
        try {
            medicalResponse = validateMedicalResponse(parsed)
        } catch (err) {
            return NextResponse.json(
                { error: 'Estructura inválida', details: (err as Error).message },
                { status: 502 }
            )
        }

        return NextResponse.json(medicalResponse)
    } catch (e) {
        const err = e as Error
        return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
    }
}
