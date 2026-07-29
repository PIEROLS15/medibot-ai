'use client'

import Header from '@/components/layout/header'
import RecommendationForm from '@/components/features/recommendation/recommendationForm'
import { useClearQueryParam } from '@/hooks/useClearQueryParam'

export default function RecommendationClient() {
    useClearQueryParam('denied')

    return (
        <div className='space-y-6 pt-10'>
            <Header
                title='Recomendación de medicamentos'
                description='Complete el formulario con sus datos para generar una recomendación'
                button={null}
            />
            <RecommendationForm />
        </div>
    )
}
