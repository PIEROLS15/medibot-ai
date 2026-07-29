"use client"

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { generatePDF } from '@/lib/recommendation/pdf'
import type { MedicalResponse, Recommendation, UserData } from '@/types/recommendation'

export function useRecommendationResult(recommendations: MedicalResponse | null, userData: UserData) {
    const { toast } = useToast()
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    const recs: Recommendation[] = recommendations?.recommendations ?? []
    const reason: string | null = recommendations?.reason ?? null
    const hasRecommendations = recs.length > 0

    const handleGeneratePDF = async () => {
        if (!hasRecommendations) return

        setIsGeneratingPDF(true)
        try {
            await generatePDF(userData, recs, reason)
            toast({
                variant: 'success',
                title: 'PDF generado exitosamente',
                description: 'El archivo se ha descargado correctamente',
                duration: 2000,
            })
        } catch (error) {
            console.error('Error al generar PDF:', error)
            toast({
                variant: 'destructive',
                title: 'Error al generar PDF',
                description: 'Hubo un problema al generar el archivo. Por favor intente nuevamente.',
                duration: 2000,
            })
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    return { recs, reason, hasRecommendations, isGeneratingPDF, handleGeneratePDF }
}
