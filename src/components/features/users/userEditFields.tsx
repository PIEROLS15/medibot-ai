'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { User } from '@/types/user'
import { getNameRoleUser } from '@/utils/user'
import TextField from '@/components/auth/ui/textField'

type EditFormData = {
    nombres: string
    apellidos: string
    email: string
    rol: string
}

interface UserEditFieldsProps {
    formData: EditFormData
    errors?: Record<string, string>
    roles: Array<User['role']>
    onChange: (name: string, value: string) => void
    onRoleChange: (value: string) => void
}

export default function UserEditFields({ formData, errors = {}, roles, onChange, onRoleChange }: UserEditFieldsProps) {
    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <TextField
                    id='nombres'
                    name='nombres'
                    type='text'
                    label='Nombres'
                    value={formData.nombres}
                    onChange={(e) => onChange('nombres', e.target.value)}
                    error={errors.nombres}
                />

                <TextField
                    id='apellidos'
                    name='apellidos'
                    type='text'
                    label='Apellidos'
                    value={formData.apellidos}
                    onChange={(e) => onChange('apellidos', e.target.value)}
                    error={errors.apellidos}
                />
            </div>

            <TextField
                id='email'
                name='email'
                type='email'
                label='Correo Electrónico'
                value={formData.email}
                onChange={(e) => onChange('email', e.target.value)}
                error={errors.email}
            />

            <div className='space-y-2'>
                <label htmlFor='rol' className='text-gray-700 dark:text-gray-300'>
                    Rol
                </label>
                <Select value={formData.rol} onValueChange={onRoleChange}>
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                        <SelectValue placeholder='Seleccionar rol' />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                                {getNameRoleUser(role.name)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.rol && <p className='text-sm text-red-500'>{errors.rol}</p>}
            </div>
        </>
    )
}
