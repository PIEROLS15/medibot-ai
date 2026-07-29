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

export function IdentificationSection({
    form,
    identification,
    errors,
    canSearch,
    isSearching,
    idNumberPlaceholder,
    onInputChange,
    onSelectChange,
    onSearch,
}: IdentificationSectionProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Field label='Tipo de Identificación' icon={<IdCard className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.idType} required>
                <Select value={form.idType} onValueChange={(value) => onSelectChange('idType', value)}>
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                        <SelectValue placeholder='Seleccionar' />
                    </SelectTrigger>
                    <SelectContent>
                        {identification.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                                {item.type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <Field label='Número de Identificación' icon={<Hash className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.idNumber} required>
                <div className='flex items-center gap-2'>
                    <Input
                        id='idNumber'
                        name='idNumber'
                        value={form.idNumber}
                        onChange={onInputChange}
                        className='dark:bg-gray-800 dark:border-gray-700'
                        placeholder={idNumberPlaceholder}
                    />
                    <Button
                        type='button'
                        onClick={onSearch}
                        className='bg-primary hover:bg-secondary text-white'
                        disabled={!canSearch || isSearching}
                    >
                        {isSearching ? 'Buscando...' : 'Buscar'}
                    </Button>
                </div>
            </Field>

            <div className='sm:col-span-2'>
                <Field label='Nombre Completo' icon={<User className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.fullName} required>
                    <Input
                        id='fullName'
                        name='fullName'
                        value={form.fullName}
                        onChange={onInputChange}
                        readOnly
                        className='dark:bg-gray-800 dark:border-gray-700'
                    />
                </Field>
            </div>
        </div>
    )
}

type PatientSectionProps = {
    form: FormRecommendation
    errors: Record<string, string>
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (name: string, value: string) => void
}

export function PatientSection({ form, errors, onInputChange, onSelectChange }: PatientSectionProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <Field label='Edad' icon={<Hourglass className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.age} required>
                <Input id='age' name='age' type='number' min='1' max='120' value={form.age} onChange={onInputChange} className='dark:bg-gray-800 dark:border-gray-700' />
            </Field>

            <Field label='Sexo' icon={<Venus className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.gender} required>
                <Select value={form.gender} onValueChange={(value) => onSelectChange('gender', value)}>
                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                        <SelectValue placeholder='Seleccionar' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='masculino'>Masculino</SelectItem>
                        <SelectItem value='femenino'>Femenino</SelectItem>
                    </SelectContent>
                </Select>
            </Field>

            <Field label='Peso (kg)' icon={<Weight className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.weight} required>
                <Input id='weight' name='weight' type='number' min='1' max='300' step='0.1' value={form.weight} onChange={onInputChange} className='dark:bg-gray-800 dark:border-gray-700' />
            </Field>
        </div>
    )
}

type SymptomsSectionProps = {
    form: FormRecommendation
    errors: Record<string, string>
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSelectChange: (name: string, value: string) => void
}

export function SymptomsSection({ form, errors, onInputChange, onSelectChange }: SymptomsSectionProps) {
    return (
        <>
            <Field label='Síntomas' icon={<Thermometer className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.symptoms} required>
                <Textarea id='symptoms' name='symptoms' value={form.symptoms} onChange={onInputChange} placeholder='Ej: dolor de cabeza, fiebre, tos' className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700' />
            </Field>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field label='Alergias' icon={<AlertCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />}>
                    <Textarea id='allergies' name='allergies' value={form.allergies} onChange={onInputChange} placeholder='Ej: penicilina, aspirina' className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700' />
                </Field>

                <Field label='Enfermedades Preexistentes' icon={<Stethoscope className='h-5 w-5 text-gray-500 dark:text-gray-400' />}>
                    <Textarea id='diseases' name='diseases' value={form.diseases} onChange={onInputChange} placeholder='Ej: diabetes, hipertensión' className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700' />
                </Field>
            </div>

            {form.gender === 'femenino' && (
                <Field label='¿Está embarazada?' icon={<Baby className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.pregnancy} required>
                    <Select value={form.pregnancy} onValueChange={(value) => onSelectChange('pregnancy', value)}>
                        <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='no'>No</SelectItem>
                            <SelectItem value='si'>Sí</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            )}

            <Field label='Medicación Actual' icon={<Pill className='h-5 w-5 text-gray-500 dark:text-gray-400' />}>
                <Textarea id='currentMedication' name='currentMedication' value={form.currentMedication} onChange={onInputChange} placeholder='Ej: enalapril 10 mg cada 12 horas' className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700' />
            </Field>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field label='Duración (días)' icon={<Clock className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.symptomDuration} required>
                    <Input id='symptomDuration' name='symptomDuration' type='number' min='1' max='365' value={form.symptomDuration} onChange={onInputChange} className='dark:bg-gray-800 dark:border-gray-700' />
                </Field>

                <Field label='Severidad' icon={<AlertCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />} error={errors.severity} required>
                    <Select value={form.severity} onValueChange={(value) => onSelectChange('severity', value)}>
                        <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                            <SelectValue placeholder='Seleccionar' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='leve'>Leve</SelectItem>
                            <SelectItem value='moderada'>Moderada</SelectItem>
                            <SelectItem value='severa'>Severa</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
            </div>
        </>
    )
}

type RecommendationStateProps = {
    isLoading: boolean
    recommendations: MedicalResponse | null
    form: FormRecommendation
}

export function RecommendationState({ isLoading, recommendations, form }: RecommendationStateProps) {
    if (isLoading) {
        return <RecommendationResult recommendations={null} userData={form} isLoading />
    }

    if (recommendations) {
        return <RecommendationResult recommendations={recommendations} userData={form} isLoading={false} />
    }

    return (
        <Card className='dark:bg-gray-900/80 dark:border-gray-800 flex flex-col items-center justify-center p-8 h-full'>
            <FileText className='h-16 w-16 text-gray-300 dark:text-gray-600 mb-4' />
            <h3 className='text-xl font-medium text-gray-700 dark:text-gray-300 mb-2'>Sin Recomendaciones</h3>
            <p className='text-gray-500 dark:text-gray-400 text-center'>
                Complete el formulario y genere una recomendación para ver los resultados aquí.
            </p>
        </Card>
    )
}
