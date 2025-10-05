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

export const recommendationSchemaForm = z.object({
    idType: z.string().nonempty("Seleccione un tipo de identificación"),
    idNumber: z.string()
        .nonempty("El número de identificación es obligatorio")
        .regex(/^\d+$/, "Debe contener solo números")
        .min(8, "Debe tener al menos 8 dígitos")
        .max(12, "No puede tener más de 12 dígitos"),
    fullName: z.string()
        .nonempty("El nombre completo es obligatorio")
        .min(3, "El nombre es demasiado corto"),
    age: z.string()
        .nonempty("La edad es obligatoria")
        .refine(val => Number(val) > 0 && Number(val) <= 120, {
            message: "La edad debe estar entre 1 y 120",
        }),
    gender: z.enum(["masculino", "femenino"], {
        errorMap: () => ({ message: "Seleccione un género válido" }),
    }),
    weight: z.string()
        .nonempty("El peso es obligatorio")
        .refine(val => Number(val) > 0 && Number(val) <= 300, {
            message: "El peso debe estar entre 1 y 300 kg",
        }),
    symptoms: z.string().nonempty("Debe ingresar al menos un síntoma"),
    allergies: z.string().optional(),
    diseases: z.string().optional(),
    pregnancy: z.string().optional(),
    currentMedication: z.string().optional(),
    symptomDuration: z.string()
        .nonempty("La duración de síntomas es obligatoria")
        .refine(val => Number(val) > 0 && Number(val) <= 365, {
            message: "Los días deben estar entre 1 y 365",
        }),
    severity: z.enum(["leve", "moderada", "severa"], {
        errorMap: () => ({ message: "Seleccione la severidad" }),
    }),
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

export function typeIdentification(idType: string) {
    if (idType === "1") return "DNI"
    if (idType === "2") return "RUC"
    return "No reportado"
}
