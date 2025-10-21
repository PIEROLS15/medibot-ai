import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useIdentification } from '@/hooks/useIdentification'
import { createFormSchema } from '@/utils/recommendation'
import { FormRecommendation, MedicalInput } from '@/types/recommendation'
import { useGeminiRecommendation } from '@/hooks/useGeminiRecommendation'

export const useRecommendation = () => {
    const { toast } = useToast()
    const { identification, fetchIdentification, searchPersonDni, searchPersonRuc } = useIdentification()
    const { isLoading: isGeminiLoading, recommendations, generateRecommendation, setRecommendations } = useGeminiRecommendation()

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
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

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

    // ✅ Buscar datos del usuario por identificación
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
    }, [
        form.idType,
        form.idNumber,
        identification,
        isValidIdNumber,
        searchPersonDni,
        searchPersonRuc,
        toast,
    ])

    //Búsqueda automática con debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (isValidIdNumber && form.idNumber !== lastSearchedId) {
            debounceRef.current = setTimeout(() => performSearch(), 1500)
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [form.idNumber, isValidIdNumber, lastSearchedId, performSearch])

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

        await generateRecommendation(processed, form.fullName)
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
