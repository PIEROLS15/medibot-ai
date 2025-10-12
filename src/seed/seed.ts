import { RoleType, TypeIdentification, TypeResultOptions } from '@prisma/client'
import bcryptjs from 'bcryptjs'

interface SeedRoles {
    name: RoleType
}

interface SeedIdentificationType {
    type: TypeIdentification
}

interface SeedResultOptions {
    type: TypeResultOptions
}

interface SeedUser {
    firstName: string
    lastName: string
    email: string
    password: string
    roleId: number
    isActive: boolean
}

interface SeedData {
    roles: SeedRoles[]
    users: SeedUser[]
    identifications: SeedIdentificationType[]
    resultOptions: SeedResultOptions[]
}

export const initialData: SeedData = {
    roles: [
        {
            name: RoleType.Administrator
        },
        {
            name: RoleType.Pharmacist
        },
        {
            name: RoleType.Visitor
        }
    ],
    identifications: [
        {
            type: TypeIdentification.DNI
        },
        {
            type: TypeIdentification.RUC
        }
    ],
    resultOptions: [
        {
            type: TypeResultOptions.Improved
        },
        {
            type: TypeResultOptions.No_changes
        }
    ],
    users: [
        {
            firstName: 'Piero',
            lastName: 'Llanos',
            email: 'piero@gmail.com',
            password: bcryptjs.hashSync('123456'),
            roleId: 1,
            isActive: true
        },
        {
            firstName: 'Diego',
            lastName: 'Llanos',
            email: 'diego@gmail.com',
            password: bcryptjs.hashSync('123456'),
            roleId: 3,
            isActive: true
        },
    ]
}
