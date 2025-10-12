import { z } from 'zod'

export const getRoleUser = (role: string) => {
    if (role === 'Administrator') return 'bg-primary hover:bg-primary text-white'
    if (role === 'Pharmacist') return 'bg-secondary hover:bg-secondary text-white'
    if (role === 'Visitor') return 'bg-green-600 hover:bg-green-700 text-white'
    return 'bg-gray-500 hover:bg-gray-600 text-white'
}

export const getNameRoleUser = (role: string) => {
    if (role === 'Administrator') return 'Administrador'
    if (role === 'Pharmacist') return 'Farmaceútico'
    if (role === 'Visitor') return 'Visitante'
    return role
}

export const getStatusUser = (status: boolean) => {
    if (status == true) {
        return 'success'
    } else {
        return 'destructive'
    }
}

export const getInitials = (names: string, lastNames: string) => {
    const firstInitial = names ? names.charAt(0).toUpperCase() : ''
    const lastInitial = lastNames ? lastNames.charAt(0).toUpperCase() : ''
    return `${firstInitial}${lastInitial}`
}

// Schema de validación con Zod
export const registerSchema = z.object({
    firstName: z.string()
        .min(1, 'El nombre es obligatorio')
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string()
        .min(1, 'Los apellidos son obligatorios')
        .min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    email: z.string()
        .email('El correo electrónico no es válido')
        .min(1, 'El correo electrónico es obligatorio'),
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .min(1, 'La contraseña es obligatoria'),
    confirmPassword: z.string()
        .min(1, 'Confirmar contraseña es obligatorio'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})
