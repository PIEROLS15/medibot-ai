import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
    RecommendationPayload,
    Recommendation as RecommendationType,
    MedicalResponse,
} from '@/types/recommendation'


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const userId = searchParams.get('userId')
        const dni = searchParams.get('dni')
        const ruc = searchParams.get('ruc')

        const include = {
            medications: true,
            evaluation: {
                include: {
                    patient: {
                        select: {
                            fullName: true,
                            identificationNumber: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
        }

        let result

        if (id) {
            const recommendation = await prisma.recommendation.findUnique({
                where: { id: Number(id) },
                include,
            })
            if (!recommendation) {
                return NextResponse.json(
                    { error: `No se encontró la recomendación con ID ${id}` },
                    { status: 404 }
                )
            }
            result = recommendation
        }

        else if (userId) {
            result = await prisma.recommendation.findMany({
                where: {
                    evaluation: { userId: Number(userId) },
                },
                include,
                orderBy: { id: 'desc' },
            })
        }

        else if (ruc) {
            result = await prisma.recommendation.findMany({
                where: {
                    evaluation: {
                        patient: {
                            identificationNumber: ruc,
                        },
                    },
                },
                include,
                orderBy: { id: 'desc' },
            })
        }

        else if (dni) {
            result = await prisma.recommendation.findMany({
                where: {
                    evaluation: {
                        patient: {
                            identificationNumber: dni,
                        },
                    },
                },
                include,
                orderBy: { id: 'desc' },
            })
        }

        else {
            result = await prisma.recommendation.findMany({
                include,
                orderBy: { id: 'desc' },
            })
        }

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.error('Error al obtener recomendaciones:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor', details: String(error) },
            { status: 500 }
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

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { id: true, email: true, firstName: true, lastName: true },
        })

        if (!user) {
            return NextResponse.json(
                { error: `Usuario con ID ${userId} no existe` },
                { status: 404 }
            )
        }

        const patient = await prisma.patient.upsert({
            where: { identificationNumber: form.idNumber },
            update: {
                fullName: form.fullName,
                identificationTypeId: Number(form.idType),
            },
            create: {
                fullName: form.fullName,
                identificationNumber: form.idNumber,
                identificationTypeId: Number(form.idType),
            },
        })

        const evaluation = await prisma.evaluation.create({
            data: {
                patientId: patient.id,
                userId: Number(userId),
                age: Number(form.age),
                sex: form.gender,
                weight: Number(form.weight),
                symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
                allergies: form.allergies
                    ? form.allergies.split(',').map((a) => a.trim()).filter(Boolean)
                    : [],
                preexistingDiseases: form.diseases
                    ? form.diseases.split(',').map((d) => d.trim()).filter(Boolean)
                    : [],
                pregnancy: form.gender === 'femenino' ? form.pregnancy === 'si' : null,
                currentMedication: form.currentMedication || null,
                symptomDuration: Number(form.symptomDuration),
                severity: form.severity,
            },
        })

        const recResult: MedicalResponse = {
            recommendations: recommendationResult.recommendations || [],
            reason: recommendationResult.reason ?? null,
        }

        const recommendation = await prisma.recommendation.create({
            data: {
                evaluationId: evaluation.id,
                reason: recResult.reason,
                medications: {
                    create: recResult.recommendations.map((rec: RecommendationType) => ({
                        medication: rec.medication,
                        form: rec.form || 'desconocido',
                        via: rec.via || 'desconocido',
                        amountValue: rec.amount_value,
                        amountUnit: rec.amount_unit,
                        everyHour: rec.every_hour || 0,
                        durationDays: rec.duration_days,
                        moment: rec.moment,
                        instructions: rec.instructions,
                        warnings: rec.warnings || [],
                    })),
                },
            },
            include: {
                medications: true,
            },
        })

        return NextResponse.json(
            {
                message: 'Recomendación almacenada exitosamente',
                recommendation,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error guardando recomendación:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor', details: String(error) },
            { status: 500 }
        )
    }
}
