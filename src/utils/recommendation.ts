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
    edad: z.number(),
    sexo: z.enum(["masculino", "femenino", "otro"]),
    peso: z.number().nullable().optional(),
    sintomas: z.array(z.string().min(1)).nonempty(),
    alergias: z.array(z.string().min(1)).nullable().optional(),
    enfermedades_preexistentes: z.array(z.string().min(1)).nullable().optional(),
    embarazo: z.boolean().nullable().optional(),
    medicacion_actual: z.string().nullable().optional(),
    duracion_dias: z.number().nullable(),
    severidad: z.enum(["leve", "moderada", "severa"]).nullable(),
})

const recommendationSchema = z.object({
    medicamento: z.string().min(1),
    forma: z.string().min(1),
    via: z.string().min(1),
    cantidad_valor: z.number(),
    cantidad_unidad: noRangeString,
    cada_horas: z.number(),
    duracion_dias: z.number(),
    momento: noRangeString,
    instrucciones: noRangeString,
    advertencias: z.array(z.string()),
})

export const medicalResponseSchema = {
    type: "OBJECT",
    properties: {
        recomendaciones: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    medicamento: { type: "STRING" },
                    forma: { type: "STRING" },
                    via: { type: "STRING" },
                    cantidad_valor: { type: "NUMBER" },
                    cantidad_unidad: { type: "STRING" },
                    cada_horas: { type: "NUMBER" },
                    duracion_dias: { type: "NUMBER" },
                    momento: { type: "STRING" },
                    instrucciones: { type: "STRING" },
                    advertencias: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: [
                    "medicamento",
                    "cantidad_valor",
                    "cantidad_unidad",
                    "cada_horas",
                    "duracion_dias",
                    "advertencias"
                ],
            }
        },
        motivo: { type: "STRING", nullable: true }
    },
    required: ["recomendaciones"]
} as const

export const medicalResponse = z.object({
    recomendaciones: z.array(recommendationSchema),
    motivo: z.string().nullable()
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

export function listSintomas(sintomas: string[]) {
    if (!sintomas || sintomas.length === 0) return "no reportado"
    return sintomas.map(s => `- ${s}`).join("\n")
}
export function listAlergias(alergias?: string[] | null) {
    if (!alergias || alergias.length === 0) return "no reportado"
    return alergias.join(", ")
}
export function listEnfermedades(enf?: string[] | null) {
    if (!enf || enf.length === 0) return "no reportado"
    return enf.join(", ")
}
export function fmtEmbarazo(embarazo?: boolean | null) {
    if (embarazo === true) return "sí"
    if (embarazo === false) return "no"
    return "no aplica"
}
