/* eslint-disable */
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

export { default } from '@/components/features/users/userEditFields'
