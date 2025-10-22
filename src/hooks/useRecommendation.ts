import { useState, useCallback, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useIdentification } from '@/hooks/useIdentification'
import { createFormSchema } from '@/utils/recommendation'
import { FormRecommendation, MedicalInput } from '@/types/recommendation'
import { useGeminiRecommendation } from '@/hooks/useGeminiRecommendation'
import { useSaveRecommendation } from '@/hooks/useSaveRecommendation'
import { useSession } from 'next-auth/react'

export const useRecommendation = () => {
    const { toast } = useToast()
    const { identification, fetchIdentification, searchPersonDni, searchPersonRuc } = useIdentification()
    const { isLoading: isGeminiLoading, recommendations, generateRecommendation, setRecommendations } = useGeminiRecommendation()
    const { createRecommendation } = useSaveRecommendation()
    const { data: session, status } = useSession()

    const [form, setForm] = useState<FormRecommendation>({
        idType: '',
        idNumber: '',
        fullName: '',
        age: '',
        gender: 'masculino',
        weight: '',
        symptoms: '',
        allergies: '',
        diseases: '',
        pregnancy: 'no',
        currentMedication: '',
        symptomDuration: '',
        severity: 'leve',
    })

    const [isSearching, setIsSearching] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [lastSearchedId, setLastSearchedId] = useState('')

    //Cargar tipos de identificación
    useEffect(() => {
        fetchIdentification()
    }, [fetchIdentification])

    //Validar número de identificación
    const isValidIdNumber = useMemo(() => {
        if (!form.idType || !form.idNumber) return false
        const selected = identification.find(i => String(i.id) === form.idType)
        const type = selected?.type?.toUpperCase()
        const num = form.idNumber.trim()
        return type === 'DNI'
            ? /^\d{8}$/.test(num)
            : type === 'RUC'
                ? /^\d{11}$/.test(num)
                : num.length > 0
    }, [form.idType, form.idNumber, identification])

    const canSearch = useMemo(() => {
        return isValidIdNumber && form.idNumber !== lastSearchedId
    }, [isValidIdNumber, form.idNumber, lastSearchedId])

    //Buscar datos del usuario por identificación
    const performSearch = useCallback(async () => {
        if (!isValidIdNumber) return
        setIsSearching(true)
        try {
            const selected = identification.find(i => String(i.id) === form.idType)
            const type = selected?.type?.toUpperCase()
            const num = Number(form.idNumber)
            let result

            if (type === 'DNI') result = await searchPersonDni(num)
            if (type === 'RUC') result = await searchPersonRuc(num)

            const name = result?.full_name || result?.razon_social
            if (name) {
                setForm(prev => ({ ...prev, fullName: name }))
                setLastSearchedId(form.idNumber)
                toast({
                    variant: 'success',
                    title: 'Usuario encontrado',
                    description: name,
                    duration: 1000,
                })
            } else {
                toast({
                    variant: 'destructive',
                    title: 'No se encontró información',
                    duration: 1000,
                })
            }
        } catch (err) {
            console.error(err)
            toast({
                variant: 'destructive',
                title: 'Error de búsqueda',
                duration: 1000,
            })
        } finally {
            setIsSearching(false)
        }
    }, [form.idType, form.idNumber, identification, isValidIdNumber, searchPersonDni, searchPersonRuc, toast])

    //Validar formulario con Zod
    const validateForm = (): boolean => {
        try {
            const schema = createFormSchema(form.idType, identification)
            schema.parse(form)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formatted: Record<string, string> = {}
                error.errors.forEach(e => (formatted[e.path[0] as string] = e.message))
                setErrors(formatted)
            }
            return false
        }
    }

    //Preparar datos y llamar al hook de Gemini
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateForm()) {
            toast({
                variant: 'destructive',
                title: 'Error de validación',
                duration: 1000,
            })
            return
        }

        if (status === 'loading') {
            toast({
                variant: 'default',
                title: 'Cargando sesión...',
                description: 'Por favor, espera un momento.',
                duration: 1500,
            })
            return
        }

        if (!session?.user?.id) {
            toast({
                variant: 'destructive',
                title: 'Usuario no autenticado',
                description: 'Por favor, inicia sesión antes de generar una recomendación.',
                duration: 2000,
            })
            return
        }

        //Datos del formulario en bruto
        const processed: MedicalInput = {
            age: Number(form.age),
            sex: form.gender,
            weight: Number(form.weight),
            symptoms: form.symptoms.split(',').map(s => s.trim()).filter(Boolean),
            allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
            preexisting_diseases: form.diseases.split(',').map(s => s.trim()).filter(Boolean),
            pregnancy: form.gender === 'femenino' ? form.pregnancy === 'si' : null,
            current_medication: form.currentMedication || null,
            duration_days: Number(form.symptomDuration),
            severity: form.severity || null,
        }

        const geminiResult = await generateRecommendation(processed, form.fullName)

        if (geminiResult && (geminiResult.recommendations?.length > 0 || geminiResult.reason)) {
            const userId = session.user.id

            //Datos a almacenar en la BD
            try {
                await createRecommendation({
                    userId,
                    form,
                    recommendationResult: {
                        ...geminiResult,
                        reason: geminiResult?.reason ?? null,
                    },
                })

            } catch (error) {
                console.error('Error al guardar recomendación:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error al guardar recomendación',
                    description: 'Hubo un problema al guardar la información',
                    duration: 2000,
                })
            }
        }
    }

    //Reiniciar formulario
    const resetForm = () => {
        setForm({
            idType: '',
            idNumber: '',
            fullName: '',
            age: '',
            gender: 'masculino',
            weight: '',
            symptoms: '',
            allergies: '',
            diseases: '',
            pregnancy: 'no',
            currentMedication: '',
            symptomDuration: '',
            severity: 'leve',
        })
        setErrors({})
        setLastSearchedId('')
        setRecommendations(null)
    }

    return {
        form,
        setForm,
        errors,
        recommendations,
        isLoading: isGeminiLoading,
        isSearching,
        identification,
        handleSubmit,
        performSearch,
        resetForm,
        canSearch,
    }
}
