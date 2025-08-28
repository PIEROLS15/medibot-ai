"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Printer, AlertTriangle } from "lucide-react"
import { jsPDF } from "jspdf"

interface DatosCliente {
    tipoId: string
    numeroId: string
    nombre: string
    edad: string
    sintomas: string
    alergias: string
    enfermedades: string
}

interface Recomendacion {
    codigo: string
    nombre: string
    instrucciones: string
    advertencias: string
}

interface RecomendacionResultadoProps {
    recomendaciones: Recomendacion[]
    datosCliente: DatosCliente
}

export default function RecomendacionResultado({ recomendaciones, datosCliente }: RecomendacionResultadoProps) {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    const mapTipoId = (tipo: string): string => {
        const tipos: Record<string, string> = {
            cedula: "Cédula",
            pasaporte: "Pasaporte",
            extranjeria: "Cédula de Extranjería",
        }
        return tipos[tipo] || tipo
    }

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true)
        try {
            const doc = new jsPDF()

            // Título
            doc.setFontSize(18)
            doc.setTextColor(18, 121, 255) // Color primario
            doc.text("Recomendación de Medicamentos", 105, 20, { align: "center" })

            // Datos del cliente
            doc.setFontSize(12)
            doc.setTextColor(0, 0, 0)
            doc.text("Datos del Cliente", 20, 35)
            doc.setFontSize(10)
            doc.text(`Nombre: ${datosCliente.nombre}`, 20, 45)
            doc.text(`Identificación: ${mapTipoId(datosCliente.tipoId)} ${datosCliente.numeroId}`, 20, 52)
            doc.text(`Edad: ${datosCliente.edad} años`, 20, 59)

            // Síntomas
            doc.setFontSize(12)
            doc.text("Síntomas Reportados", 20, 70)
            doc.setFontSize(10)

            // Manejar texto largo con saltos de línea
            const splitSintomas = doc.splitTextToSize(datosCliente.sintomas, 170)
            doc.text(splitSintomas, 20, 77)

            // Alergias y enfermedades
            let yPos = 77 + splitSintomas.length * 7

            if (datosCliente.alergias) {
                doc.setFontSize(12)
                doc.text("Alergias", 20, yPos)
                doc.setFontSize(10)
                const splitAlergias = doc.splitTextToSize(datosCliente.alergias, 170)
                doc.text(splitAlergias, 20, yPos + 7)
                yPos += splitAlergias.length * 7 + 10
            }

            if (datosCliente.enfermedades) {
                doc.setFontSize(12)
                doc.text("Enfermedades Preexistentes", 20, yPos)
                doc.setFontSize(10)
                const splitEnfermedades = doc.splitTextToSize(datosCliente.enfermedades, 170)
                doc.text(splitEnfermedades, 20, yPos + 7)
                yPos += splitEnfermedades.length * 7 + 10
            }

            // Recomendaciones
            doc.setFontSize(14)
            doc.setTextColor(18, 121, 255) // Color primario
            doc.text("Medicamentos Recomendados", 105, yPos, { align: "center" })

            yPos += 10

            // Iterar sobre cada recomendación
            recomendaciones.forEach((rec, index) => {
                // Si no hay espacio suficiente, agregar nueva página
                if (yPos > 250) {
                    doc.addPage()
                    yPos = 20
                }

                doc.setFontSize(12)
                doc.setTextColor(0, 0, 0)
                doc.text(`${index + 1}. ${rec.nombre} (${rec.codigo})`, 20, yPos)

                doc.setFontSize(10)
                yPos += 7

                doc.text("Instrucciones:", 20, yPos)
                const splitInstrucciones = doc.splitTextToSize(rec.instrucciones, 170)
                doc.text(splitInstrucciones, 30, yPos + 7)
                yPos += splitInstrucciones.length * 7 + 7

                doc.text("Advertencias:", 20, yPos)
                const splitAdvertencias = doc.splitTextToSize(rec.advertencias, 170)
                doc.text(splitAdvertencias, 30, yPos + 7)
                yPos += splitAdvertencias.length * 7 + 15
            })

            // Pie de página
            const fecha = new Date().toLocaleDateString()
            doc.setFontSize(8)
            doc.text(`Generado el ${fecha} - FarmaSystem`, 105, 285, { align: "center" })

            // Guardar PDF
            doc.save(`Recomendacion_${datosCliente.nombre.replace(/\s+/g, "_")}.pdf`)
        } catch (error) {
            console.error("Error al generar PDF:", error)
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
                            variant="outline"
                            size="sm"
                            className="text-gray-600 dark:text-gray-300 dark:border-gray-700 bg-transparent"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4 mr-1" />
                            Imprimir
                        </Button>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-secondary"
                            onClick={handleGeneratePDF}
                            disabled={isGeneratingPDF}
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Datos del Cliente</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                                <p className="font-medium text-gray-900 dark:text-white">{datosCliente.nombre}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Identificación</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {mapTipoId(datosCliente.tipoId)} {datosCliente.numeroId}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Edad</p>
                                <p className="font-medium text-gray-900 dark:text-white">{datosCliente.edad} años</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Síntomas Reportados</h3>
                        <p className="text-gray-700 dark:text-gray-300">{datosCliente.sintomas}</p>
                    </div>

                    {datosCliente.alergias && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Alergias</h3>
                            <p className="text-gray-700 dark:text-gray-300">{datosCliente.alergias}</p>
                        </div>
                    )}

                    {datosCliente.enfermedades && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Enfermedades Preexistentes</h3>
                            <p className="text-gray-700 dark:text-gray-300">{datosCliente.enfermedades}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Medicamentos Recomendados</h3>

                        <div className="space-y-6 overflow-hidden">
                            {recomendaciones.map((rec, index) => (
                                <div
                                    key={rec.codigo}
                                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 break-words"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-primary">
                                            {rec.nombre} <span className="text-sm text-gray-500 dark:text-gray-400">({rec.codigo})</span>
                                        </h4>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Instrucciones:</p>
                                            <p className="text-gray-600 dark:text-gray-400">{rec.instrucciones}</p>
                                        </div>

                                        <Alert
                                            variant="warning"
                                            className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50"
                                        >
                                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                            <AlertDescription className="text-yellow-800 dark:text-yellow-500">
                                                {rec.advertencias}
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
