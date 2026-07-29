/* eslint-disable */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useRecommendation } from '@/hooks/useRecommendation'
import {
    IdentificationSection,
    PatientSection,
    RecommendationState,
    SymptomsSection,
} from './recommendationSections'

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
        idNumberPlaceholder,
    } = useRecommendation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
            <Card className='dark:bg-gray-900/80 dark:border-gray-800'>
                <CardContent className='pt-6'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <IdentificationSection
                            form={form}
                            identification={identification}
                            errors={errors}
                            canSearch={canSearch}
                            isSearching={isSearching}
                            idNumberPlaceholder={idNumberPlaceholder}
                            onInputChange={handleChange}
                            onSelectChange={handleSelectChange}
                            onSearch={performSearch}
                        />

                        <PatientSection
                            form={form}
                            errors={errors}
                            onInputChange={handleChange}
                            onSelectChange={handleSelectChange}
                        />

                        <SymptomsSection
                            form={form}
                            errors={errors}
                            onInputChange={handleChange}
                            onSelectChange={handleSelectChange}
                        />

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

            <RecommendationState isLoading={isLoading} recommendations={recommendations} form={form} />
        </div>
    )
}

export { default } from '@/components/features/recommendation/recommendationForm'
