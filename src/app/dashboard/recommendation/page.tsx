import { Suspense } from 'react'
import RecommendationClient from './RecommendationClient'

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <RecommendationClient />
        </Suspense>
    )
}
