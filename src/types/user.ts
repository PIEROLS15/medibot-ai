export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    password: string
    resetToken?: string
    resetTokenExpiresAt?: string
    roleId: number
    isActive: boolean
    miembro: boolean
    createdAt: string
    updatedAt: string
    role: {
        id: number
        name: string
    }
}

export interface UsuarioSession {
    usuario_id: number
    nombre: string
    apellido: string
    correo: string
    direccion: string | null
    ciudad: string | null
    codigo_postal: string | null
    rol_id: number
    role: string
    miembro: boolean
}