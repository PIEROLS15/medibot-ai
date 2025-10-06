"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
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
import RecommendationResult from "./recommendationResult"
import { useIdentification } from "@/hooks/useIdentification"
import { z } from "zod"

interface Identification {
    id: string | number
    type?: string
}

// Schema de validación dinámico
const createFormSchema = (idType: string, identification: Identification[]) => {
    const selected = identification.find(i => String(i.id) === idType)
    const tipo = selected?.type?.toUpperCase()

    let idNumberValidation = z.string().min(1, "Número de identificación es requerido")

    if (tipo === "DNI") {
        idNumberValidation = idNumberValidation
            .length(8, "El DNI debe tener exactamente 8 dígitos")
            .regex(/^\d+$/, "El DNI solo debe contener números")
    } else if (tipo === "RUC") {
        idNumberValidation = idNumberValidation
            .length(11, "El RUC debe tener exactamente 11 dígitos")
            .regex(/^\d+$/, "El RUC solo debe contener números")
    }

    return z.object({
        idType: z.string().min(1, "Tipo de identificación es requerido"),
        idNumber: idNumberValidation,
        fullName: z.string().min(3, "Nombre es requerido"),
        age: z.string()
            .min(1, "Edad es requerida")
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 120
            }, "Edad es requerido"),
        gender: z.enum(["masculino", "femenino"], {
            required_error: "Sexo es requerido"
        }),
        weight: z.string()
            .min(1, "Peso es requerido")
            .refine((val) => {
                const num = parseFloat(val)
                return !isNaN(num) && num >= 1 && num <= 300
            }, "Peso es requerido"),
        symptoms: z.string().min(3, "Debe ingresar al menos un síntoma"),
        allergies: z.string(),
        diseases: z.string(),
        pregnancy: z.enum(["si", "no"]),
        currentMedication: z.string(),
        symptomDuration: z.string()
            .min(1, "Duración de síntomas es requerida")
            .refine((val) => {
                const num = parseInt(val)
                return !isNaN(num) && num >= 1 && num <= 365
            }, "Duración de síntomas es requerida"),
        severity: z.preprocess(
            (val) => val === "" ? undefined : val,
            z.enum(["leve", "moderada", "severa"], {
                required_error: "Severidad es requerida"
            })
        )
    })
}

interface FormRecommendation {
    idType: string
    idNumber: string
    fullName: string
    age: string
    gender: string
    weight: string
    symptoms: string
    allergies: string
    diseases: string
    pregnancy: string
    currentMedication: string
    symptomDuration: string
    severity: string
}

export interface Recommendation {
    medication: string
    form: string
    via: string
    amount_value: number
    amount_unit: string
    every_hour: number
    duration_days: number
    moment: string
    instructions: string
    warnings: string[]
}

const RecommendationForm = () => {
    const [formRecommendation, setFormRecommendation] = useState<FormRecommendation>({
        idType: "",
        idNumber: "",
        fullName: "",
        age: "",
        gender: "masculino",
        weight: "",
        symptoms: "",
        allergies: "",
        diseases: "",
        pregnancy: "no",
        currentMedication: "",
        symptomDuration: "",
        severity: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [recomendaciones, setRecomendaciones] = useState<Recommendation[] | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [lastSearchedId, setLastSearchedId] = useState<string>("")
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const { identification, fetchIdentification, searchPersonDni, searchPersonRuc } = useIdentification()

    useEffect(() => {
        fetchIdentification()
    }, [fetchIdentification])

    // Validar si el número de identificación es válido según el tipo
    const isValidIdNumber = useMemo(() => {
        if (!formRecommendation.idType || !formRecommendation.idNumber) return false

        const selected = identification.find(i => String(i.id) === formRecommendation.idType)
        const tipo = selected?.type?.toUpperCase()
        const numero = formRecommendation.idNumber.trim()

        if (tipo === "DNI") {
            return /^\d{8}$/.test(numero)
        } else if (tipo === "RUC") {
            return /^\d{11}$/.test(numero)
        }

        return numero.length > 0
    }, [formRecommendation.idType, formRecommendation.idNumber, identification])

    const canSearch = useMemo(() => {
        return isValidIdNumber && formRecommendation.idNumber !== lastSearchedId
    }, [isValidIdNumber, formRecommendation.idNumber, lastSearchedId])

    const performSearch = useCallback(async () => {
        if (!isValidIdNumber) return

        setIsSearching(true)
        try {
            const selected = identification.find(i => String(i.id) === formRecommendation.idType)
            const tipo = selected?.type?.toUpperCase()
            const numero = Number(formRecommendation.idNumber)

            if (tipo === "DNI") {
                const result = await searchPersonDni(numero)
                if (result?.full_name) {
                    setFormRecommendation(prev => ({ ...prev, fullName: result.full_name }))
                    setLastSearchedId(formRecommendation.idNumber)
                }
            } else if (tipo === "RUC") {
                const result = await searchPersonRuc(numero)
                if (result?.razon_social) {
                    setFormRecommendation(prev => ({ ...prev, fullName: result.razon_social }))
                    setLastSearchedId(formRecommendation.idNumber)
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSearching(false)
        }
    }, [formRecommendation.idType, formRecommendation.idNumber, identification, isValidIdNumber, searchPersonDni, searchPersonRuc])

    const handleSearch = async () => {
        await performSearch()
    }

    // Auto-búsqueda con debounce
    useEffect(() => {
        // Limpiar timer anterior
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        // Si el número es válido y diferente al último buscado, programar búsqueda
        if (isValidIdNumber && formRecommendation.idNumber !== lastSearchedId) {
            debounceTimerRef.current = setTimeout(() => {
                performSearch()
            }, 1500) // Esperar 1.5 segundos después de que el usuario deje de escribir
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [formRecommendation.idNumber, isValidIdNumber, lastSearchedId, performSearch])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
    ) => {
        const { name, value } = e.target

        // Si cambia el tipo de ID, limpiar número y nombre
        if (name === "idType") {
            setFormRecommendation((prev) => ({
                ...prev,
                [name]: value,
                idNumber: "",
                fullName: ""
            }))
            setLastSearchedId("")
        } else if (name === "idNumber") {
            // Si cambia el número, resetear el lastSearchedId si es diferente
            if (value !== lastSearchedId) {
                setLastSearchedId("")
            }
            setFormRecommendation((prev) => ({ ...prev, [name]: value }))
        } else {
            setFormRecommendation((prev) => ({ ...prev, [name]: value }))
        }

        // Limpiar error del campo cuando el usuario escribe
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        if (name === "idType") {
            setFormRecommendation((prev) => ({
                ...prev,
                [name]: value,
                idNumber: "",
                fullName: ""
            }))
            setLastSearchedId("")
        } else {
            setFormRecommendation((prev) => ({ ...prev, [name]: value }))
        }

        // Limpiar error del campo cuando el usuario cambia la selección
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = (): boolean => {
        try {
            const schema = createFormSchema(formRecommendation.idType, identification)
            schema.parse(formRecommendation)
            setValidationErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                setValidationErrors(errors)
            }
            return false
        }
    }

    const processDataForBackend = (data: FormRecommendation) => {
        const sintomasArray = data.symptoms
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)

        const alergiasArray = data.allergies
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0)

        const enfermedadesArray = data.diseases
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e.length > 0)

        const embarazoValue = data.gender === "femenino" ? data.pregnancy === "si" : null

        return {
            age: Number.parseInt(data.age),
            sex: data.gender,
            weight: Number.parseFloat(data.weight),
            symptoms: sintomasArray,
            allergies: alergiasArray,
            preexisting_diseases: enfermedadesArray,
            pregnancy: embarazoValue,
            current_medication: data.currentMedication || null,
            duration_days: Number.parseInt(data.symptomDuration),
            severity: data.severity,
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validar formulario antes de enviar
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const backendData = processDataForBackend(formRecommendation)
            console.log("Datos para backend:", backendData)

            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData)
            })

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`)
            }

            const data = await response.json()

            console.log("Respuesta del backend:", data)

            setRecomendaciones(data)

        } catch (error) {
            console.error("Error al generar recomendación:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormRecommendation({
            idType: "",
            idNumber: "",
            fullName: "",
            age: "",
            gender: "masculino",
            weight: "",
            symptoms: "",
            allergies: "",
            diseases: "",
            pregnancy: "no",
            currentMedication: "",
            symptomDuration: "",
            severity: "",
        })
        setRecomendaciones(null)
        setValidationErrors({})
        setLastSearchedId("")
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
                                        <Label htmlFor="idType" className="text-gray-700 dark:text-gray-300">
                                            Tipo de Identificación <span className="text-red-500">*</span>
                                        </Label>
                                    </div>
                                    <Select
                                        value={formRecommendation.idType}
                                        onValueChange={(value) => handleSelectChange("idType", value)}
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
                                    {validationErrors.idType && (
                                        <p className="text-sm text-red-500">{validationErrors.idType}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="idNumber" className="text-gray-700 dark:text-gray-300">
                                            Número de Identificación <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="idNumber"
                                            name="idNumber"
                                            value={formRecommendation.idNumber}
                                            onChange={handleChange}
                                            className="dark:bg-gray-800 dark:border-gray-700"
                                            placeholder={
                                                formRecommendation.idType ?
                                                    (identification.find(i => String(i.id) === formRecommendation.idType)?.type?.toUpperCase() === "DNI"
                                                        ? "8 dígitos"
                                                        : "11 dígitos")
                                                    : ""
                                            }
                                        />

                                        <Button
                                            type="button"
                                            onClick={handleSearch}
                                            className="bg-primary hover:bg-secondary text-white"
                                            disabled={!canSearch || isSearching}
                                        >
                                            {isSearching ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Buscando...
                                                </>
                                            ) : (
                                                "Buscar"
                                            )}
                                        </Button>
                                    </div>
                                    {validationErrors.idNumber && (
                                        <p className="text-sm text-red-500">{validationErrors.idNumber}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
                                        Nombre Completo <span className="text-red-500">*</span>
                                    </Label>
                                </div>

                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formRecommendation.fullName}
                                    onChange={handleChange}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                                {validationErrors.fullName && (
                                    <p className="text-sm text-red-500">{validationErrors.fullName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Hourglass className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                                            Edad <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={formRecommendation.age}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {validationErrors.age && (
                                        <p className="text-sm text-red-500">{validationErrors.age}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Venus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300">
                                            Sexo <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Select value={formRecommendation.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="masculino">Masculino</SelectItem>
                                            <SelectItem value="femenino">Femenino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {validationErrors.gender && (
                                        <p className="text-sm text-red-500">{validationErrors.gender}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Weight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="weight" className="text-gray-700 dark:text-gray-300">
                                            Peso (kg) <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Input
                                        id="weight"
                                        name="weight"
                                        type="number"
                                        min="1"
                                        max="300"
                                        step="0.1"
                                        value={formRecommendation.weight}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {validationErrors.weight && (
                                        <p className="text-sm text-red-500">{validationErrors.weight}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <Label htmlFor="symptoms" className="text-gray-700 dark:text-gray-300">
                                        Síntomas <span className="text-red-500">*</span>
                                    </Label>
                                </div>

                                <Textarea
                                    id="symptoms"
                                    name="symptoms"
                                    value={formRecommendation.symptoms}
                                    onChange={handleChange}
                                    placeholder="Ej: dolor de cabeza, fiebre, tos"
                                    className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                />
                                {validationErrors.symptoms && (
                                    <p className="text-sm text-red-500">{validationErrors.symptoms}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="allergies" className="text-gray-700 dark:text-gray-300">
                                            Alergias
                                        </Label>
                                    </div>

                                    <Textarea
                                        id="allergies"
                                        name="allergies"
                                        value={formRecommendation.allergies}
                                        onChange={handleChange}
                                        placeholder="Ej: penicilina, aspirina (dejar vacío si no tiene)"
                                        className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="diseases" className="text-gray-700 dark:text-gray-300">
                                            Enfermedades Preexistentes
                                        </Label>
                                    </div>

                                    <Textarea
                                        id="diseases"
                                        name="diseases"
                                        value={formRecommendation.diseases}
                                        onChange={handleChange}
                                        placeholder="Ej: diabetes, hipertensión (dejar vacío si no tiene)"
                                        className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                    />
                                </div>
                            </div>

                            {formRecommendation.gender === "femenino" && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Baby className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="pregnancy" className="text-gray-700 dark:text-gray-300">
                                            ¿Está embarazada? <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Select value={formRecommendation.pregnancy} onValueChange={(value) => handleSelectChange("pregnancy", value)}>
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
                                    <Label htmlFor="currentMedication" className="text-gray-700 dark:text-gray-300">
                                        Medicación Actual
                                    </Label>
                                </div>

                                <Textarea
                                    id="currentMedication"
                                    name="currentMedication"
                                    value={formRecommendation.currentMedication}
                                    onChange={handleChange}
                                    placeholder="Ej: enalapril 10 mg cada 12 horas (dejar vacío si no consume medicamentos)"
                                    className="min-h-[80px] dark:bg-gray-800 dark:border-gray-700"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="symptomDuration" className="text-gray-700 dark:text-gray-300">
                                            Duración de los síntomas (días) <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Input
                                        id="symptomDuration"
                                        name="symptomDuration"
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={formRecommendation.symptomDuration}
                                        onChange={handleChange}
                                        className="dark:bg-gray-800 dark:border-gray-700"
                                    />
                                    {validationErrors.symptomDuration && (
                                        <p className="text-sm text-red-500">{validationErrors.symptomDuration}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <Label htmlFor="severity" className="text-gray-700 dark:text-gray-300">
                                            Severidad de los sintomas <span className="text-red-500">*</span>
                                        </Label>
                                    </div>

                                    <Select
                                        value={formRecommendation.severity}
                                        onValueChange={(value) => handleSelectChange("severity", value)}
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
                                    {validationErrors.severity && (
                                        <p className="text-sm text-red-500">{validationErrors.severity}</p>
                                    )}
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

                {isLoading ? (
                    <RecommendationResult
                        recommendations={[]}
                        userData={formRecommendation}
                        isLoading={true}
                    />
                ) : recomendaciones ? (
                    <RecommendationResult
                        recommendations={recomendaciones}
                        userData={formRecommendation}
                        isLoading={false}
                    />
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
        </>
    )
}

export default RecommendationForm
