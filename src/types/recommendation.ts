//Backend
export interface MedicalInput {
    age: number
    sex: "masculino" | "femenino"
    weight?: number | null
    symptoms: string[]
    allergies?: string[] | null
    preexisting_diseases?: string[] | null
    pregnancy?: boolean | null
    current_medication?: string | null
    duration_days: number | null
    severity: "leve" | "moderada" | "severa" | null
}

export interface Recommendation {
    medication: string
    form: string
    via: string
    amount_value: number
    amount_unit: string
    every_hour: number
    duration_days: number
    moment: string
    instructions: string
    warnings: string[]
}

export interface MedicalResponse {
    recommendations: Recommendation[]
    reason: string | null
}

//Frontend
export interface FormRecommendation {
    idType: string
    idNumber: string
    fullName: string
    age: string
    gender: string
    weight: string
    symptoms: string
    allergies: string
    diseases: string
    pregnancy: string
    currentMedication: string
    symptomDuration: string
    severity: string
}

export type UserData = Pick<FormRecommendation,
    'idType' | 'idNumber' | 'fullName' | 'age' | 'symptoms' | 'allergies' | 'diseases'>
