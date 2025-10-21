import { z } from 'zod'
import { recommendationSchema } from './recommendation.schema'

export const medicalResponse = z.object({
    recommendations: z.array(recommendationSchema),
    reason: z.string().nullable()
})
