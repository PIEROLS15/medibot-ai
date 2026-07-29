import prisma from '@/lib/prisma'
import type { MedicalResponse, RecommendationPayload, Recommendation as RecommendationType } from '@/types/recommendation.backend'

const recommendationInclude = {
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
} as const

function splitList(value?: string | null) {
    return value
        ? value.split(',').map((item) => item.trim()).filter(Boolean)
        : []
}

export async function listRecommendations(filters: {
    id?: string | null
    userId?: string | null
    dni?: string | null
    ruc?: string | null
}) {
    const { id, userId, dni, ruc } = filters

    if (id) {
        const recommendation = await prisma.recommendation.findUnique({
            where: { id: Number(id) },
            include: recommendationInclude,
        })

        if (!recommendation) {
            throw new Error(`No se encontró la recomendación con ID ${id}`)
        }

        return recommendation
    }

    if (userId) {
        return prisma.recommendation.findMany({
            where: { evaluation: { userId: Number(userId) } },
            include: recommendationInclude,
            orderBy: { id: 'desc' },
        })
    }

    if (ruc) {
        return prisma.recommendation.findMany({
            where: {
                evaluation: { patient: { identificationNumber: ruc } },
            },
            include: recommendationInclude,
            orderBy: { id: 'desc' },
        })
    }

    if (dni) {
        return prisma.recommendation.findMany({
            where: {
                evaluation: { patient: { identificationNumber: dni } },
            },
            include: recommendationInclude,
            orderBy: { id: 'desc' },
        })
    }

    return prisma.recommendation.findMany({
        include: recommendationInclude,
        orderBy: { id: 'desc' },
    })
}

export async function storeRecommendation(payload: RecommendationPayload) {
    const { userId, form, recommendationResult } = payload

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, email: true, firstName: true, lastName: true },
    })

    if (!user) {
        throw new Error(`Usuario con ID ${userId} no existe`)
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
            symptoms: splitList(form.symptoms),
            allergies: splitList(form.allergies),
            preexistingDiseases: splitList(form.diseases),
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

    return prisma.recommendation.create({
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
}
