'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Loader2,
    FileText,
    IdCard,
    Hash,
    User,
    Hourglass,
    Venus,
    Weight,
    Thermometer,
    AlertTriangle,
    Stethoscope,
    Pill,
    Clock,
    AlertCircle,
    Baby
} from 'lucide-react'
import RecommendationResult from './recommendationResult'
import { useRecommendation } from '@/hooks/useRecommendation'

const RecommendationForm = () => {
    const {
        form,
        setForm,
        errors,
        recommendations,
        isLoading,
        isSearching,
        identification,
        handleSubmit,
        performSearch,
        resetForm,
        canSearch,
    } = useRecommendation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSearch = async () => {
        await performSearch()
    }

    return (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
            <Card className='dark:bg-gray-900/80 dark:border-gray-800'>
                <CardContent className='pt-6'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {/* Tipo de Identificación */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <IdCard className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Tipo de Identificación <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Select
                                    value={form.idType}
                                    onValueChange={(value) => handleSelectChange('idType', value)}
                                >
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
                                {errors.idType && <p className='text-sm text-red-500'>{errors.idType}</p>}
                            </div>

                            {/* Número de Identificación */}
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Hash className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Número de Identificación <span className='text-red-500'>*</span>
                                    </Label>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <Input
                                        id='idNumber'
                                        name='idNumber'
                                        value={form.idNumber}
                                        onChange={handleChange}
                                        className='dark:bg-gray-800 dark:border-gray-700'
                                        placeholder={
                                            form.idType
                                                ? (identification.find(i => String(i.id) === form.idType)?.type?.toUpperCase() === 'DNI'
                                                    ? '8 dígitos'
                                                    : '11 dígitos')
                                                : ''
                                        }
                                    />
                                    <Button
                                        type='button'
                                        onClick={handleSearch}
                                        className='bg-primary hover:bg-secondary text-white'
                                        disabled={!canSearch || isSearching}
                                    >
                                        {isSearching ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Buscando...
                                            </>
                                        ) : (
                                            'Buscar'
                                        )}
                                    </Button>
                                </div>
                                {errors.idNumber && <p className='text-sm text-red-500'>{errors.idNumber}</p>}
                            </div>
                        </div>

                        {/* Nombre completo */}
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <User className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                <Label className='text-gray-700 dark:text-gray-300'>
                                    Nombre Completo <span className='text-red-500'>*</span>
                                </Label>
                            </div>
                            <Input
                                id='fullName'
                                name='fullName'
                                value={form.fullName}
                                onChange={handleChange}
                                readOnly
                                className='dark:bg-gray-800 dark:border-gray-700'
                            />
                            {errors.fullName && <p className='text-sm text-red-500'>{errors.fullName}</p>}
                        </div>

                        {/* Edad, Sexo, Peso */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Hourglass className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Edad <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Input
                                    id='age'
                                    name='age'
                                    type='number'
                                    min='1'
                                    max='120'
                                    value={form.age}
                                    onChange={handleChange}
                                    className='dark:bg-gray-800 dark:border-gray-700'
                                />
                                {errors.age && <p className='text-sm text-red-500'>{errors.age}</p>}
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Venus className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Sexo <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Select value={form.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                                        <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='masculino'>Masculino</SelectItem>
                                        <SelectItem value='femenino'>Femenino</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className='text-sm text-red-500'>{errors.gender}</p>}
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Weight className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Peso (kg) <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Input
                                    id='weight'
                                    name='weight'
                                    type='number'
                                    min='1'
                                    max='300'
                                    step='0.1'
                                    value={form.weight}
                                    onChange={handleChange}
                                    className='dark:bg-gray-800 dark:border-gray-700'
                                />
                                {errors.weight && <p className='text-sm text-red-500'>{errors.weight}</p>}
                            </div>
                        </div>

                        {/* Síntomas */}
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <Thermometer className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                <Label className='text-gray-700 dark:text-gray-300'>
                                    Síntomas <span className='text-red-500'>*</span>
                                </Label>
                            </div>
                            <Textarea
                                id='symptoms'
                                name='symptoms'
                                value={form.symptoms}
                                onChange={handleChange}
                                placeholder='Ej: dolor de cabeza, fiebre, tos'
                                className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700'
                            />
                            {errors.symptoms && <p className='text-sm text-red-500'>{errors.symptoms}</p>}
                        </div>

                        {/* Alergias y Enfermedades */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <AlertTriangle className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>Alergias</Label>
                                </div>
                                <Textarea
                                    id='allergies'
                                    name='allergies'
                                    value={form.allergies}
                                    onChange={handleChange}
                                    placeholder='Ej: penicilina, aspirina'
                                    className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Stethoscope className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>Enfermedades Preexistentes</Label>
                                </div>
                                <Textarea
                                    id='diseases'
                                    name='diseases'
                                    value={form.diseases}
                                    onChange={handleChange}
                                    placeholder='Ej: diabetes, hipertensión'
                                    className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700'
                                />
                            </div>
                        </div>

                        {/* Embarazo (solo si femenino) */}
                        {form.gender === 'femenino' && (
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Baby className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        ¿Está embarazada? <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Select value={form.pregnancy} onValueChange={(v) => handleSelectChange('pregnancy', v)}>
                                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='no'>No</SelectItem>
                                        <SelectItem value='si'>Sí</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Medicación actual */}
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <Pill className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                <Label className='text-gray-700 dark:text-gray-300'>Medicación Actual</Label>
                            </div>
                            <Textarea
                                id='currentMedication'
                                name='currentMedication'
                                value={form.currentMedication}
                                onChange={handleChange}
                                placeholder='Ej: enalapril 10 mg cada 12 horas'
                                className='min-h-[80px] dark:bg-gray-800 dark:border-gray-700'
                            />
                        </div>

                        {/* Duración y Severidad */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Clock className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Duración (días) <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Input
                                    id='symptomDuration'
                                    name='symptomDuration'
                                    type='number'
                                    min='1'
                                    max='365'
                                    value={form.symptomDuration}
                                    onChange={handleChange}
                                    className='dark:bg-gray-800 dark:border-gray-700'
                                />
                                {errors.symptomDuration && <p className='text-sm text-red-500'>{errors.symptomDuration}</p>}
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <AlertCircle className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                                    <Label className='text-gray-700 dark:text-gray-300'>
                                        Severidad <span className='text-red-500'>*</span>
                                    </Label>
                                </div>
                                <Select value={form.severity} onValueChange={(v) => handleSelectChange('severity', v)}>
                                    <SelectTrigger className='dark:bg-gray-800 dark:border-gray-700'>
                                        <SelectValue placeholder='Seleccionar' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='leve'>Leve</SelectItem>
                                        <SelectItem value='moderada'>Moderada</SelectItem>
                                        <SelectItem value='severa'>Severa</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.severity && <p className='text-sm text-red-500'>{errors.severity}</p>}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className='flex justify-end space-x-3 pt-4'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={resetForm}
                                className='dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent'
                            >
                                Limpiar
                            </Button>
                            <Button type='submit' className='bg-primary hover:bg-secondary text-white' disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Generando...
                                    </>
                                ) : (
                                    'Generar Recomendación'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {isLoading ? (
                <RecommendationResult recommendations={[]} userData={form} isLoading />
            ) : recommendations ? (
                <RecommendationResult recommendations={recommendations} userData={form} isLoading={false} />
            ) : (
                <Card className='dark:bg-gray-900/80 dark:border-gray-800 flex flex-col items-center justify-center p-8 h-full'>
                    <FileText className='h-16 w-16 text-gray-300 dark:text-gray-600 mb-4' />
                    <h3 className='text-xl font-medium text-gray-700 dark:text-gray-300 mb-2'>Sin Recomendaciones</h3>
                    <p className='text-gray-500 dark:text-gray-400 text-center'>
                        Complete el formulario y genere una recomendación para ver los resultados aquí.
                    </p>
                </Card>
            )}
        </div>
    )
}

export default RecommendationForm
