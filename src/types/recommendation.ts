import { Severity, Sex } from '@/lib/validations/recommendation'

//Backend
export interface MedicalInput {
    age: number
    sex: Sex
    weight?: number | null
    symptoms: string[]
    allergies?: string[] | null
    preexisting_diseases?: string[] | null
    pregnancy?: boolean | null
    current_medication?: string | null
    duration_days: number | null
    severity: Severity | null
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

export interface RecommendationPayload {
    userId: number
    form: FormRecommendation
    recommendationResult: MedicalResponse
}

//Frontend
export interface FormRecommendation {
    idType: string
    idNumber: string
    fullName: string
    age: string
    gender: Sex
    weight: string
    symptoms: string
    allergies: string
    diseases: string
    pregnancy: string
    currentMedication: string
    symptomDuration: string
    severity: Severity
}

export type UserData = Pick<FormRecommendation,
    'idType' | 'idNumber' | 'fullName' | 'age' | 'symptoms' | 'allergies' | 'diseases'>
