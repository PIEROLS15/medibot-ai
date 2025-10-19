import { z } from 'zod'

export const registerSchema = z
    .object({
        firstName: z.string().min(1, 'El nombre es obligatorio'),
        lastName: z.string().min(1, 'El apellido es obligatorio'),
        email: z
            .string()
            .email('Debe ser un correo electrónico válido')
            .min(1, 'El correo es obligatorio'),
        password: z
            .string()
            .min(6, 'Debe tener al menos 6 caracteres')
            .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
            .regex(/[0-9]/, 'Debe incluir al menos un número')
            .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un símbolo'),
        confirmPassword: z.string().min(6, 'Debe confirmar su contraseña'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Las contraseñas no coinciden',
    })

export type RegisterSchema = z.infer<typeof registerSchema>
