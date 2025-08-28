"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Loader2,
    FileText,
    IdCard,
    Hash,
    User,
    Hourglass,
    Venus,
    Weight,
    Thermometer,
    AlertTriangle,
    Stethoscope,
    Pill,
    Clock,
    AlertCircle,
    Baby
} from "lucide-react"
import RecomendacionResultado from "./recomendacion-resultado"
import RegistroClienteModal from "./registro-cliente-modal"
import { useIdentification } from "@/hooks/useIdentification"

interface FormData {
    tipoId: string
    numeroId: string
    nombre: string
    edad: string
    sexo: string
    peso: string
    sintomas: string
    alergias: string
    enfermedades: string
    embarazo: string
    medicacionActual: string
    duracionDias: string
    severidad: string
}

interface Recomendacion {
    codigo: string
    nombre: string
    instrucciones: string
    advertencias: string
}

const RecommendationForm = () => {
    const [formData, setFormData] = useState<FormData>({
        tipoId: "",
        numeroId: "",
        nombre: "",
        edad: "",
        sexo: "masculino", // Establecer valor por defecto
        peso: "",
        sintomas: "",
        alergias: "",
        enfermedades: "",
        embarazo: "no",
        medicacionActual: "",
        duracionDias: "",
        severidad: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [recomendaciones, setRecomendaciones] = useState<Recomendacion[] | null>(null)
    const [showRegistroModal, setShowRegistroModal] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const { identification, fetchIdentification, searchPersonDni, searchPersonRuc } = useIdentification()

    useEffect(() => {
        fetchIdentification()
    }, [fetchIdentification])

    // Deshabilitar botón hasta que tenga tipo y número
    const canSearch = useMemo(() => {
        return Boolean(formData.tipoId) && formData.numeroId.trim().length > 0
    }, [formData.tipoId, formData.numeroId])

    const handleSearch = async () => {
        if (!canSearch) return
        setIsSearching(true)
        try {
            const selected = identification.find(i => String(i.id) === formData.tipoId)

            // Si tu API te da el tipo por nombre:
            const tipo = selected?.type?.toUpperCase()
            const numero = Number(formData.numeroId)

            if (tipo === "DNI") {
                const result = await searchPersonDni(numero)
                console.log("Resultado DNI:", result)
            } else if (tipo === "RUC") {

                const result = await searchPersonRuc(numero)
                console.log("Resultado RUC:", result)
            } else {
                console.warn("Tipo de identificación no soportado:", tipo)
            }

        } catch (err) {
            console.error(err)
        } finally {
            setIsSearching(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const processDataForBackend = (data: FormData) => {
        // Procesar síntomas (convertir string a array)
        const sintomasArray = data.sintomas
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

        // Procesar alergias (convertir string a array)
        const alergiasArray = data.alergias
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0)

        // Procesar enfermedades preexistentes (convertir string a array)
        const enfermedadesArray = data.enfermedades
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0)

        // Procesar embarazo (solo para mujeres)
        const embarazoValue = data.sexo === "femenino" ? data.embarazo === "si" : null

        return {
            edad: Number.parseInt(data.edad),
            sexo: data.sexo,
            peso: Number.parseFloat(data.peso),
            sintomas: sintomasArray,
            alergias: alergiasArray,
            enfermedades_preexistentes: enfermedadesArray,
            embarazo: embarazoValue,
            medicacion_actual: data.medicacionActual || null,
            duracion_dias: Number.parseInt(data.duracionDias),
            severidad: data.severidad,
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Procesar datos para el backend
            const backendData = processDataForBackend(formData)
            console.log("Datos para backend:", backendData)

            // Aquí enviarías los datos al backend
            // const response = await fetch('/api/recomendacion', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(backendData)
            // })

            // Simulación de procesamiento
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Datos de ejemplo para la demostración
            const recomendacionesEjemplo: Recomendacion[] = [
                {
                    codigo: "MED-001",
                    nombre: "Paracetamol 500mg",
                    instrucciones: "Tomar 1 tableta cada 8 horas después de las comidas durante 5 días.",
                    advertencias: "No consumir alcohol durante el tratamiento. No exceder la dosis recomendada.",
                },
                {
                    codigo: "MED-045",
                    nombre: "Ibuprofeno 400mg",
                    instrucciones: "Tomar 1 tableta cada 12 horas con alimentos durante 3 días.",
                    advertencias: "No recomendado para personas con problemas gástricos o úlceras.",
                },
            ]

            setRecomendaciones(recomendacionesEjemplo)

            // Simulación de cliente no registrado
            const clienteRegistrado = Math.random() > 0.5
            if (!clienteRegistrado) {
                setTimeout(() => {
                    setShowRegistroModal(true)
                }, 1000)
            }
        } catch (error) {
            console.error("Error al generar recomendación:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            tipoId: "",
            numeroId: "",
            nombre: "",
            edad: "",
            sexo: "masculino", // Mantener valor por defecto
            peso: "",
            sintomas: "",
            alergias: "",
            enfermedades: "",
            embarazo: "no",
            medicacionActual: "",
            duracionDias: "",
            severidad: "",
        })
        setRecomendaciones(null)
    }

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="dark:bg-gray-900/80 dark:border-gray-800">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <IdCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="tipoId" className="text-gray-700 dark:text-gray-300">
                                            Tipo de Identificación
                                        </Label>
                                    </div>
                                    <Select
                                        value={formData.tipoId}
                                        onValueChange={(value) => handleSelectChange("tipoId", value)}
                                        required
                                    >
                                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {identification.map((item) => (
                                                <SelectItem key={item.id} value={String(item.id)}>
                                                    {item.type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="numeroId" className="text-gray-700 dark:text-gray-300">
                                            Número de Identificación
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="numeroId"
                                            name="numeroId"
                                            value={formData.numeroId}
                                            onChange={handleChange}
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                            required
                                        />

                                        <Button type="button" onClick={handleSearch} className="bg-primary hover:bg-secondary text-white" disabled={!canSearch || isSearching}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Buscando...
                                                </>
                                            ) : (
                                                "Buscar"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <Label htmlFor="nombre" className="text-gray-700 dark:text-gray-300">
                                        Nombre Completo
                                    </Label>
                                </div>

                                <Input
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hourglass className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="edad" className="text-gray-700 dark:text-gray-300">
                                            Edad
                                        </Label>
                                    </div>

                                    <Input
                                        id="edad"
                                        name="edad"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={formData.edad}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Venus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="sexo" className="text-gray-700 dark:text-gray-300">
                                            Sexo
                                        </Label>
                                    </div>

                                    <Select value={formData.sexo} onValueChange={(value) => handleSelectChange("sexo", value)} required>
                                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="masculino">Masculino</SelectItem>
                                            <SelectItem value="femenino">Femenino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Weight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="peso" className="text-gray-700 dark:text-gray-300">
                                            Peso (kg)
                                        </Label>
                                    </div>

                                    <Input
                                        id="peso"
                                        name="peso"
                                        type="number"
                                        min="1"
                                        max="300"
                                        step="0.1"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <Label htmlFor="sintomas" className="text-gray-700 dark:text-gray-300">
                                        Síntomas
                                    </Label>
                                </div>

                                <Textarea
                                    id="sintomas"
                                    name="sintomas"
                                    value={formData.sintomas}
                                    onChange={handleChange}
                                    placeholder="Ej: dolor de cabeza, fiebre, tos"
                                    className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="alergias" className="text-gray-700 dark:text-gray-300">
                                            Alergias
                                        </Label>
                                    </div>

                                    <Textarea
                                        id="alergias"
                                        name="alergias"
                                        value={formData.alergias}
                                        onChange={handleChange}
                                        placeholder="Ej: penicilina, aspirina (dejar vacío si no tiene)"
                                        className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="enfermedades" className="text-gray-700 dark:text-gray-300">
                                            Enfermedades Preexistentes
                                        </Label>
                                    </div>

                                    <Textarea
                                        id="enfermedades"
                                        name="enfermedades"
                                        value={formData.enfermedades}
                                        onChange={handleChange}
                                        placeholder="Ej: diabetes, hipertensión (dejar vacío si no tiene)"
                                        className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            {formData.sexo === "femenino" && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Baby className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="embarazo" className="text-gray-700 dark:text-gray-300">
                                            ¿Está embarazada?
                                        </Label>
                                    </div>

                                    <Select value={formData.embarazo} onValueChange={(value) => handleSelectChange("embarazo", value)}>
                                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no">No</SelectItem>
                                            <SelectItem value="si">Sí</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <Label htmlFor="medicacionActual" className="text-gray-700 dark:text-gray-300">
                                        Medicación Actual
                                    </Label>
                                </div>

                                <Textarea
                                    id="medicacionActual"
                                    name="medicacionActual"
                                    value={formData.medicacionActual}
                                    onChange={handleChange}
                                    placeholder="Ej: enalapril 10 mg cada 12 horas (dejar vacío si no consume medicamentos)"
                                    className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="duracionDias" className="text-gray-700 dark:text-gray-300">
                                            Duración de los síntomas (días)
                                        </Label>
                                    </div>

                                    <Input
                                        id="duracionDias"
                                        name="duracionDias"
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={formData.duracionDias}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="severidad" className="text-gray-700 dark:text-gray-300">
                                            Severidad
                                        </Label>
                                    </div>

                                    <Select
                                        value={formData.severidad}
                                        onValueChange={(value) => handleSelectChange("severidad", value)}
                                        required
                                    >
                                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="leve">Leve</SelectItem>
                                            <SelectItem value="moderada">Moderada</SelectItem>
                                            <SelectItem value="severa">Severa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                                >
                                    Limpiar
                                </Button>
                                <Button type="submit" className="bg-primary hover:bg-secondary text-white" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        "Generar Recomendación"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {recomendaciones ? (
                    <RecomendacionResultado recomendaciones={recomendaciones} datosCliente={formData} />
                ) : (
                    <Card className="dark:bg-gray-900/80 dark:border-gray-800 flex flex-col items-center justify-center p-8 h-full">
                        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Sin Recomendaciones</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            Complete el formulario y genere una recomendación para ver los resultados aquí.
                        </p>
                    </Card>
                )}
            </div>

            <RegistroClienteModal open={showRegistroModal} onOpenChange={setShowRegistroModal} datosCliente={formData} />
        </>
    )
}

export default RecommendationForm
