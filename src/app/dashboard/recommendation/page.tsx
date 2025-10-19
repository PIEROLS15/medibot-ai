'use client'

import Header from '@/components/layout/header'
import RecommendationForm from '@/components/layout/recommendation/recommendationForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Recommendation = () => {

    const params = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (params.get('denied')) {
            const cleanUrl = window.location.pathname
            router.replace(cleanUrl)
        }
    }, [params, router])

    return (
        <>
            <div className='space-y-6 pt-10'>
                <Header
                    title='Recomendación de medicamentos'
                    description='Complete el formulario con sus datos para generar una recomendación'
                    button={null}
                />

                <RecommendationForm />

            </div>
        </>
    )
}

export default Recommendation
