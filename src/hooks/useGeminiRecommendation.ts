import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Recommendation, MedicalInput, MedicalResponse } from '@/types/recommendation'

interface UseGeminiRecommendationResult {
    isLoading: boolean
    recommendations: { recommendations: Recommendation[]; reason?: string | null } | null
    setRecommendations: React.Dispatch<
        React.SetStateAction<{ recommendations: Recommendation[]; reason?: string | null } | null>
    >
    error: string | null
    generateRecommendation: (
        data: MedicalInput,
        userName?: string
    ) => Promise<{ recommendations: Recommendation[]; reason?: string | null } | null>
}

export const useGeminiRecommendation = (): UseGeminiRecommendationResult => {
    const [isLoading, setIsLoading] = useState(false)
    const [recommendations, setRecommendations] = useState<{
        recommendations: Recommendation[]
        reason?: string | null
    } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const generateRecommendation = async (
        data: MedicalInput,
        userName?: string
    ): Promise<{ recommendations: Recommendation[]; reason?: string | null } | null> => {
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
                duration: 3000,
            })

            return {
                recommendations: result.recommendations || [],
                reason: result.reason || null,
            } as MedicalResponse
        } catch (err) {
            console.error('Error en generateRecommendation:', err)
            const message =
                err instanceof Error ? err.message : 'Error desconocido al generar la recomendación'
            setError(message)

            toast({
                variant: 'destructive',
                title: 'Error al generar recomendación',
                description: message,
                duration: 3000,
            })

            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, recommendations, setRecommendations, error, generateRecommendation }
}
