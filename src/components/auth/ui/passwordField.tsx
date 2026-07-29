'use client'

import type React from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PasswordFieldProps {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    showPassword: boolean
    onToggleVisibility: () => void
    error?: string
    placeholder?: string
}

export default function PasswordField({
    id,
    label,
    value,
    onChange,
    showPassword,
    onToggleVisibility,
    error,
    placeholder = '••••••••',
}: PasswordFieldProps) {
    return (
        <div className='space-y-2'>
            <Label htmlFor={id} className='text-gray-700 dark:text-gray-300 font-medium'>
                {label}
            </Label>
            <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                <Input
                    id={id}
                    name={id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className='pl-10 pr-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                />
                <button
                    type='button'
                    onClick={onToggleVisibility}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    )
}
