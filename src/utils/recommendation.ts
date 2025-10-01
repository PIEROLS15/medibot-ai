import { z } from "zod"

export type MedicalInput = z.infer<typeof medicalSchema>
export type MedicalResponse = z.infer<typeof medicalResponse>

// Detecta rangos como "1-2", "1 – 2" o "1 a 2"
const hasRange = (s?: string) =>
    !!s && /(\d+\s*[--]\s*\d+|\b\d+\s*a\s+\d+\b)/i.test(s)

// String sin rangos
const noRangeString = z
    .string()
    .min(1)
    .refine((val) => !hasRange(val), { message: "No debe contener rangos" })

const medicalSchema = z.object({
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

const recommendationSchema = z.object({
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

export const medicalResponseSchema = {
    type: "OBJECT",
    properties: {
        recommendations: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    medication: { type: "STRING" },
                    form: { type: "STRING" },
                    via: { type: "STRING" },
                    amount_value: { type: "NUMBER" },
                    amount_unit: { type: "STRING" },
                    every_hour: { type: "NUMBER" },
                    duration_days: { type: "NUMBER" },
                    moment: { type: "STRING" },
                    instructions: { type: "STRING" },
                    warnings: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: [
                    "medication",
                    "amount_value",
                    "amount_unit",
                    "every_hour",
                    "duration_days",
                    "warnings"
                ],
            }
        },
        reason: { type: "STRING", nullable: true }
    },
    required: ["recommendations"]
} as const

export const medicalResponse = z.object({
    recommendations: z.array(recommendationSchema),
    reason: z.string().nullable()
})

//Validar los campos de salida
export function validateMedicalResponse(input: unknown): MedicalResponse {
    return medicalResponse.parse(input)
}

//Validar los campos de entrada
export function validateMedicalInput(body: unknown): MedicalInput {
    return medicalSchema.parse(body)
}

//Validar que sea json
export async function safeJson(r: Response) {
    try { return await r.json() } catch { return await r.text() }
}

export function listSymptoms(symptoms: string[]) {
    if (!symptoms || symptoms.length === 0) return "no reportado"
    return symptoms.map(s => `- ${s}`).join("\n")
}

export function listAllergies(allergies?: string[] | null) {
    if (!allergies || allergies.length === 0) return "no reportado"
    return allergies.join(", ")
}

export function listDiseases(diseases?: string[] | null) {
    if (!diseases || diseases.length === 0) return "no reportado"
    return diseases.join(", ")
}

export function fmtPregnancy(pregnancy?: boolean | null) {
    if (pregnancy === true) return "sí"
    if (pregnancy === false) return "no"
    return "no aplica"
}
