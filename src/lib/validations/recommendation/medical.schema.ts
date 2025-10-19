import { z } from "zod"

export const medicalSchema = z.object({
    age: z.number(),
    sex: z.enum(["masculino", "femenino"]),
    weight: z.number().nullable().optional(),
    symptoms: z.array(z.string().min(1)).nonempty(),
    allergies: z.array(z.string().min(1)).nullable().optional(),
    preexisting_diseases: z.array(z.string().min(1)).nullable().optional(),
    pregnancy: z.boolean().nullable().optional(),
    current_medication: z.string().nullable().optional(),
    duration_days: z.number().nullable(),
    severity: z.enum(["leve", "moderada", "severa"]).nullable(),
})

export type MedicalSchema = z.infer<typeof medicalSchema>
