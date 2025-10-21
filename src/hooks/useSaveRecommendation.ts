import { useState, useCallback } from 'react'
import { RecommendationPayload } from '@/types/recommendation'

export function useSaveRecommendation() {
    const [isSaving, setIsSaving] = useState(false)

    const createRecommendation = useCallback(async (data: RecommendationPayload) => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (!response.ok) {
                throw new Error(result.error || 'Error al guardar la recomendación')
            }
            return result
        } catch (error) {
            console.error('Error al guardar la recomendación:', error)
            throw error
        } finally {
            setIsSaving(false)
        }
    }, [])

    return { createRecommendation, isSaving }
}
