import { z } from "zod"

const hasRange = (s?: string) =>
    !!s && /(\d+\s*[--]\s*\d+|\b\d+\s*a\s+\d+\b)/i.test(s)

const noRangeString = z
    .string()
    .min(1)
    .refine((val) => !hasRange(val), { message: "No debe contener rangos" })

export const recommendationSchema = z.object({
    medication: z.string().min(1),
    form: z.string().min(1),
    via: z.string().min(1),
    amount_value: z.number(),
    amount_unit: noRangeString,
    every_hour: z.number(),
    duration_days: z.number(),
    moment: noRangeString,
    instructions: noRangeString,
    warnings: z.array(z.string()),
})

export type RecommendationSchema = z.infer<typeof recommendationSchema>
