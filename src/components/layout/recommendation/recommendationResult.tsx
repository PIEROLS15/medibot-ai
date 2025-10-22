"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { typeIdentification } from '@/utils/recommendation'
import { generatePDF } from '@/utils/pdfGenerator'
import { Recommendation, UserData } from '@/types/recommendation'

interface RecomendacionResultadoProps {
    recommendations: Recommendation[] | { recommendations: Recommendation[]; reason?: string | null } | null
    userData: UserData
    isLoading?: boolean
}

export default function RecommendationResult({
    recommendations,
    userData,
    isLoading,
}: RecomendacionResultadoProps) {
    const { toast } = useToast()
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    if (isLoading) {
        return (
            <Card className="dark:bg-gray-900/80 dark:border-gray-800 flex flex-col items-center justify-center p-8 h-full">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-gray-700 dark:text-gray-300">Generando recomendaciones...</p>
            </Card>
        )
    }

    let recs: Recommendation[] = []
    let reason: string | null = null

    if (Array.isArray(recommendations)) {
        recs = recommendations
    } else if (recommendations && typeof recommendations === "object") {
        recs = recommendations.recommendations ?? []
        reason = recommendations.reason ?? null
    }

    const hasRecommendations = recs.length > 0

    const handleGeneratePDF = async () => {
        if (!hasRecommendations) return

        setIsGeneratingPDF(true)
        try {
            await generatePDF(userData, recs, reason)
            toast({
                variant: "success",
                title: "PDF generado exitosamente",
                description: `El archivo se ha descargado correctamente`,
                duration: 2000,
            })
        } catch (error) {
            console.error("Error al generar PDF:", error)
            toast({
                variant: "destructive",
                title: "Error al generar PDF",
                description: "Hubo un problema al generar el archivo. Por favor intente nuevamente.",
                duration: 2000,
            })
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    return (
        <Card className="dark:bg-gray-900/80 dark:border-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span>Recomendación</span>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleGeneratePDF}
                            disabled={!hasRecommendations || isGeneratingPDF}
                        >
                            <Download className="h-4 w-4 mr-1" />
                            {isGeneratingPDF ? "Generando..." : "Guardar PDF"}
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Datos del Cliente
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                                <p className="font-medium text-gray-900 dark:text-white">{userData.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de identificación</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {typeIdentification(userData.idType)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Identificación</p>
                                <p className="font-medium text-gray-900 dark:text-white">{userData.idNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Edad</p>
                                <p className="font-medium text-gray-900 dark:text-white">{userData.age} años</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Síntomas Reportados
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">{userData.symptoms}</p>
                    </div>

                    {userData.allergies && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Alergias</h3>
                            <p className="text-gray-700 dark:text-gray-300">{userData.allergies}</p>
                        </div>
                    )}

                    {userData.diseases && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Enfermedades Preexistentes
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">{userData.diseases}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Medicamentos Recomendados
                        </h3>

                        {hasRecommendations ? (
                            <div className="space-y-6 overflow-hidden">
                                {recs.map((rec, index) => (
                                    <div
                                        key={`${rec.medication}-${index}`}
                                        className={`break-words ${index === recs.length - 1 ? "" : "border-b border-gray-200 dark:border-gray-700 pb-4"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-primary">
                                                {rec.medication} {rec.amount_value}
                                                {rec.amount_unit}
                                            </h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Instrucciones:
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {rec.instructions}, {rec.moment} durante {rec.duration_days} día(s)
                                                </p>
                                            </div>
                                            {rec.warnings?.length > 0 && (
                                                <div className="space-y-2">
                                                    {rec.warnings.map((w, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex flex-row items-center gap-2 rounded-md border px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50"
                                                        >
                                                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                                                            <span className="text-sm text-yellow-800 dark:text-yellow-500">{w}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <Alert className="flex flex-row items-center gap-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50">
                                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0" />
                                        <AlertDescription className="text-red-800 dark:text-red-500">
                                            Estas recomendaciones son de carácter informativo y no sustituyen la valoración médica profesional.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        ) : reason ? (
                            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50">
                                <div className="flex items-start space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                                    <AlertDescription className="text-red-800 dark:text-red-500 whitespace-pre-line">
                                        {reason}
                                    </AlertDescription>
                                </div>
                            </Alert>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">No hay recomendaciones disponibles.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
