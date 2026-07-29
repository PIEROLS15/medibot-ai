'use client'

import type React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    icon?: React.ReactNode
    wrapperClassName?: string
}

export default function TextField({ label, error, icon, wrapperClassName, className, ...props }: TextFieldProps) {
    return (
        <div className={`space-y-2 ${wrapperClassName || ''}`}>
            <Label htmlFor={props.id} className='text-gray-700 dark:text-gray-300 font-medium'>
                {label}
            </Label>
            <div className='relative'>
                {icon}
                <Input
                    {...props}
                    className={`${icon ? 'pl-10' : 'pl-3'} border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white ${className || ''}`}
                />
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    )
}
