import { z } from 'zod'
import { medicalSchema, medicalResponse } from '@/lib/validations/recommendation'

export type MedicalInput = z.infer<typeof medicalSchema>
export type MedicalResponse = z.infer<typeof medicalResponse>

export function validateMedicalResponse(input: unknown): MedicalResponse {
    return medicalResponse.parse(input)
}

export function validateMedicalInput(body: unknown): MedicalInput {
    return medicalSchema.parse(body)
}
