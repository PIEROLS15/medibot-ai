import { useState, useCallback } from 'react'
import { Identification } from '@/types/user'

export function useIdentification() {
    const [identification, setIdentification] = useState<Identification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchIdentification = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/identification`)
            if (!res.ok) throw new Error('Error al obtener los tipos de identifaciones')
            const data = await res.json()
            if (res.ok) {
                setIdentification(data)
            } else {
                console.log('No se pudieron obtener los tipos de identificaciones')
            }
        } catch (error) {
            console.error('Error al obtener los tipos de identificaciones', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const searchPersonDni = useCallback(async (dni: number) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/reniec/dni?numero=${dni}`, { method: "GET" })
            if (!res.ok) throw new Error("Error al obtener los datos del usuario")
            const data = await res.json()
            return data
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
            const res = await fetch(`/api/reniec/ruc?numero=${ruc}`, { method: "GET" })
            if (!res.ok) throw new Error("Error al obtener los datos del usuario")
            const data = await res.json()
            return data
        } catch (error) {
            console.error("Error al obtener los datos del usuario", error)
            return undefined
        } finally {
            setLoading(false)
        }
    }, [])

    return { identification, loading, fetchIdentification, searchPersonDni, searchPersonRuc }
}
