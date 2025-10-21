import { z } from 'zod'

//Validación formulario
interface Identification {
    id: string | number
    type?: string
}

export const createFormSchema = (idType: string, identification: Identification[]) => {
    const selected = identification.find(i => String(i.id) === idType)
    const tipo = selected?.type?.toUpperCase()

    let idNumberValidation = z.string().min(1, 'Número de identificación es requerido')

    if (tipo === 'DNI') {
        idNumberValidation = idNumberValidation
            .length(8, 'El DNI debe tener exactamente 8 dígitos')
            .regex(/^\d+$/, 'El DNI solo debe contener números')
    } else if (tipo === 'RUC') {
        idNumberValidation = idNumberValidation
            .length(11, 'El RUC debe tener exactamente 11 dígitos')
            .regex(/^\d+$/, 'El RUC solo debe contener números')
    }

    return z.object({
        idType: z.string().min(1, 'Tipo de identificación es requerido'),
        idNumber: idNumberValidation,
        fullName: z.string().min(3, 'Nombre es requerido'),
        age: z.string()
            .min(1, 'Edad es requerida')
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 120
            }, 'Edad es requerido'),
        gender: z.enum(['masculino', 'femenino'], {
            required_error: 'Sexo es requerido'
        }),
        weight: z.string()
            .min(1, 'Peso es requerido')
            .refine((val) => {
                const num = parseFloat(val)
                return !isNaN(num) && num >= 1 && num <= 300
            }, 'Peso es requerido'),
        symptoms: z.string().min(3, 'Debe ingresar al menos un síntoma'),
        allergies: z.string(),
        diseases: z.string(),
        pregnancy: z.enum(['si', 'no']),
        currentMedication: z.string(),
        symptomDuration: z.string()
            .min(1, 'Duración de síntomas es requerida')
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 365
            }, 'Duración de síntomas es requerida'),
        severity: z.preprocess(
            (val) => val === '' ? undefined : val,
            z.enum(['leve', 'moderada', 'severa'], {
                required_error: 'Severidad es requerida'
            })
        )
    })
}
