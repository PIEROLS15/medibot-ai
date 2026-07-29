/* eslint-disable */
'use client'

import type { ChangeEvent, ReactNode } from 'react'
import { AlertCircle, Baby, Clock, FileText, Hash, Hourglass, IdCard, Pill, Stethoscope, Thermometer, User, Venus, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { FormRecommendation, MedicalResponse } from '@/types/recommendation'
import type { Identification } from '@/types/user'
import RecommendationResult from './recommendationResult'

type FieldProps = {
    label: string
    icon: ReactNode
    error?: string
    children: ReactNode
    required?: boolean
}

function Field({ label, icon, error, children, required = false }: FieldProps) {
    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-2'>
                {icon}
                <Label className='text-gray-700 dark:text-gray-300'>
                    {label} {required && <span className='text-red-500'>*</span>}
                </Label>
            </div>
            {children}
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    )
}

type IdentificationSectionProps = {
    form: FormRecommendation
    identification: Identification[]
    errors: Record<string, string>
    canSearch: boolean
    isSearching: boolean
    idNumberPlaceholder: string
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (name: string, value: string) => void
    onSearch: () => void
}

export * from '@/components/features/recommendation/recommendationSections'

type PatientSectionProps = {
    form: FormRecommendation
    errors: Record<string, string>
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (name: string, value: string) => void
}

// reexported from components/features/recommendation/recommendationSections

type SymptomsSectionProps = {
    form: FormRecommendation
    errors: Record<string, string>
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (name: string, value: string) => void
}

// reexported from components/features/recommendation/recommendationSections

type RecommendationStateProps = {
    isLoading: boolean
    recommendations: MedicalResponse | null
    form: FormRecommendation
}

// reexported from components/features/recommendation/recommendationSections
