import { Severity, Sex } from '@/lib/validations/recommendation'

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
