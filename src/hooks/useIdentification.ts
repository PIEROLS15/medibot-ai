import { useState, useCallback } from 'react'
import { Identification } from '@/types/user'
import { requestJson } from '@/lib/http'

type IdentificationLookupResult = {
    full_name?: string
    razon_social?: string
}

export function useIdentification() {
    const [identification, setIdentification] = useState<Identification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchIdentification = useCallback(async () => {
        setLoading(true)
        try {
            const data = await requestJson<Identification[]>('/api/identification')
            setIdentification(data)
        } catch (error) {
            console.error('Error al obtener los tipos de identificaciones', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const searchPersonDni = useCallback(async (dni: number) => {
        setLoading(true)
        try {
            return await requestJson<IdentificationLookupResult>(`/api/reniec/dni?numero=${dni}`, { method: 'GET' })
        } catch (error) {
            console.error("Error al obtener los datos del usuario", error)
            return undefined
        } finally {
            setLoading(false)
        }
    }, [])

    const searchPersonRuc = useCallback(async (ruc: number) => {
        setLoading(true)
        try {
            return await requestJson<IdentificationLookupResult>(`/api/reniec/ruc?numero=${ruc}`, { method: 'GET' })
        } catch (error) {
            console.error("Error al obtener los datos del usuario", error)
            return undefined
        } finally {
            setLoading(false)
        }
    }, [])

    return { identification, loading, fetchIdentification, searchPersonDni, searchPersonRuc }
}
