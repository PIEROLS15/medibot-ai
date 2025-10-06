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

//Validación formulario
interface Identification {
    id: string | number
    type?: string
}

export const createFormSchema = (idType: string, identification: Identification[]) => {
    const selected = identification.find(i => String(i.id) === idType)
    const tipo = selected?.type?.toUpperCase()

    let idNumberValidation = z.string().min(1, "Número de identificación es requerido")

    if (tipo === "DNI") {
        idNumberValidation = idNumberValidation
            .length(8, "El DNI debe tener exactamente 8 dígitos")
            .regex(/^\d+$/, "El DNI solo debe contener números")
    } else if (tipo === "RUC") {
        idNumberValidation = idNumberValidation
            .length(11, "El RUC debe tener exactamente 11 dígitos")
            .regex(/^\d+$/, "El RUC solo debe contener números")
    }

    return z.object({
        idType: z.string().min(1, "Tipo de identificación es requerido"),
        idNumber: idNumberValidation,
        fullName: z.string().min(3, "Nombre es requerido"),
        age: z.string()
            .min(1, "Edad es requerida")
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 120
            }, "Edad es requerido"),
        gender: z.enum(["masculino", "femenino"], {
            required_error: "Sexo es requerido"
        }),
        weight: z.string()
            .min(1, "Peso es requerido")
            .refine((val) => {
                const num = parseFloat(val)
                return !isNaN(num) && num >= 1 && num <= 300
            }, "Peso es requerido"),
        symptoms: z.string().min(3, "Debe ingresar al menos un síntoma"),
        allergies: z.string(),
        diseases: z.string(),
        pregnancy: z.enum(["si", "no"]),
        currentMedication: z.string(),
        symptomDuration: z.string()
            .min(1, "Duración de síntomas es requerida")
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 365
            }, "Duración de síntomas es requerida"),
        severity: z.preprocess(
            (val) => val === "" ? undefined : val,
            z.enum(["leve", "moderada", "severa"], {
                required_error: "Severidad es requerida"
            })
        )
    })
}


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
