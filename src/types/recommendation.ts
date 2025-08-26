export interface MedicalInput {
    edad: number
    sexo: "masculino" | "femenino" | "otro"
    peso?: number | null
    sintomas: string[]
    alergias?: string[] | null
    enfermedades_preexistentes?: string[] | null
    embarazo?: boolean | null
    medicacion_actual?: string | null
    duracion_dias: number | null
    severidad: "leve" | "moderada" | "severa" | null
}

export interface Recommendation {
    medicamento: string
    forma: string
    via: string
    cantidad_valor: number
    cantidad_unidad: string
    cada_horas: number
    duracion_dias: number
    momento: string
    instrucciones: string
    advertencias: string[]
}

export interface MedicalResponse {
    recomendaciones: Recommendation[]
    motivo: string | null
}
