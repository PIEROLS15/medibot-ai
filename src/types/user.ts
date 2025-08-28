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
    role: Role
}

export interface Role {
    id: number
    name: string
}

export interface Identification {
    id: number
    type: string
}
