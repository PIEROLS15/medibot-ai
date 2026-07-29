import { useState, useCallback } from 'react'
import { Role } from '@/types/user'
import { requestJson } from '@/lib/http'

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const data = await requestJson<Role[]>('/api/roles')
            setRoles(data)
        } catch (error) {
            console.error('Error al obtener roles', error)
        } finally {
            setLoading(false)
        }
    }, [])

    return { roles, loading, fetchRoles }
}
