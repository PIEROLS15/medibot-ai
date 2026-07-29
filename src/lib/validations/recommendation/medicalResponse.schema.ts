import { z } from 'zod'
import { recommendationSchema } from './recommendation.schema'

export const medicalResponseSchema = {
    type: 'OBJECT',
    properties: {
        recommendations: {
            type: 'ARRAY',
            items: {
                type: 'OBJECT',
                properties: {
                    medication: { type: 'STRING' },
                    form: { type: 'STRING' },
                    via: { type: 'STRING' },
                    amount_value: { type: 'NUMBER' },
                    amount_unit: { type: 'STRING' },
                    every_hour: { type: 'NUMBER' },
                    duration_days: { type: 'NUMBER' },
                    moment: { type: 'STRING' },
                    instructions: { type: 'STRING' },
                    warnings: { type: 'ARRAY', items: { type: 'STRING' } },
                },
                required: [
                    'medication',
                    'amount_value',
                    'amount_unit',
                    'every_hour',
                    'duration_days',
                    'warnings',
                ],
            },
        },
        reason: { type: 'STRING', nullable: true },
    },
    required: ['recommendations'],
} as const

export const medicalResponse = z.object({
    recommendations: z.array(recommendationSchema),
    reason: z.string().nullable()
})
