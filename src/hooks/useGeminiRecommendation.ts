import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Recommendation, MedicalInput } from '@/types/recommendation'

interface UseGeminiRecommendationResult {
    isLoading: boolean
    recommendations: Recommendation[] | null
    setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[] | null>>
    error: string | null
    generateRecommendation: (data: MedicalInput, userName?: string) => Promise<Recommendation[] | null>
}

export const useGeminiRecommendation = (): UseGeminiRecommendationResult => {
    const [isLoading, setIsLoading] = useState(false)
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const generateRecommendation = async (data: MedicalInput, userName?: string): Promise<Recommendation[] | null> => {
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

            const result = await res.json()
            setRecommendations(result)

            toast({
                variant: 'success',
                title: 'Recomendación generada',
                description: userName ? `Se generó exitosamente la recomendación para ${userName}` : 'Recomendación creada correctamente',
                duration: 3000,
            })

            return result
        } catch (err) {
            console.error('Error en generateRecommendation:', err)
            const message = err instanceof Error ? err.message : 'Error desconocido al generar la recomendación'
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
