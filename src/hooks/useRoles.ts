import { useState, useCallback } from 'react'
import { Role } from '@/types/user'

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/roles`)
            if (!res.ok) throw new Error('Error al obtener los roles')
            const data = await res.json()
            if (res.ok) {
                setRoles(data)
            } else {
                console.log('No se pudieron obtener los roles')
            }
        } catch (error) {
            console.error('Error al obtener roles', error)
        } finally {
            setLoading(false)
        }
    }, [])

    return { roles, loading, fetchRoles }
}
