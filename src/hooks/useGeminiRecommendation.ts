import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { MedicalInput, MedicalResponse } from '@/types/recommendation.backend'

interface UseGeminiRecommendationResult {
    isLoading: boolean
    recommendations: MedicalResponse | null
    setRecommendations: React.Dispatch<React.SetStateAction<MedicalResponse | null>>
    error: string | null
    generateRecommendation: (
        data: MedicalInput,
        userName?: string
    ) => Promise<MedicalResponse | null>
}

export const useGeminiRecommendation = (): UseGeminiRecommendationResult => {
    const [isLoading, setIsLoading] = useState(false)
    const [recommendations, setRecommendations] = useState<MedicalResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const generateRecommendation = async (
        data: MedicalInput,
        userName?: string
    ): Promise<MedicalResponse | null> => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error(`Error en la API: ${res.status}`)
            }

            const result: MedicalResponse = await res.json()

            // Guardamos todo el objeto
            setRecommendations({
                recommendations: result.recommendations || [],
                reason: result.reason || null,
            })

            toast({
                variant: 'success',
                title: 'Recomendación generada',
                description: userName
                    ? `Se generó exitosamente la recomendación para ${userName}`
                    : 'Recomendación creada correctamente',
                duration: 2000,
            })

            return {
                recommendations: result.recommendations || [],
                reason: result.reason || null,
            }
        } catch (err) {
            console.error('Error en generateRecommendation:', err)
            const message =
                err instanceof Error ? err.message : 'Error desconocido al generar la recomendación'
            setError(message)

            toast({
                variant: 'destructive',
                title: 'Error al generar recomendación',
                description: message,
                duration: 2000,
            })

            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, recommendations, setRecommendations, error, generateRecommendation }
}
