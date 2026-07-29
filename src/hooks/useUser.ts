import { useState, useEffect, useCallback } from 'react'
import { User, RegisterUser } from '@/types/user'
import { useToast } from '@/hooks/use-toast'
import { requestJson } from '@/lib/http'

export function useUser() {
    const [user, setUser] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchUser = useCallback(async () => {
        setLoading(true)
        try {
            const data = await requestJson<User[]>('/api/users/')
            setUser(data)
        } catch (error) {
            console.error('Error fetching user:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Hubo un problema al cargar los usuarios',
                duration: 2000,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const registerUser = useCallback(async (userData: RegisterUser) => {
        setLoading(true)
        try {
            await requestJson('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            toast({
                variant: 'success',
                title: 'Éxito',
                description: `El usuario ${userData.firstName} ${userData.lastName} se ha creado correctamente`,
                duration: 2000,
            })
            return true

        } catch (error) {
            console.error('Error registering user:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Hubo un problema al registrar el usuario',
                duration: 2000,
            })
            return false
        } finally {
            setLoading(false)
        }
    }, [toast])

    const updateStatusUser = useCallback(async (userId: number, userData: Partial<User>, newStatus: boolean) => {
        setLoading(true)
        try {
            await requestJson(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: newStatus })
            })

            toast({
                variant: 'success',
                title: 'Éxito',
                description: `El usuario ${userData.firstName} ${userData.lastName} se ha ${newStatus ? 'activado' : 'desactivado'} correctamente`,
                duration: 2000,
            })
        } catch (error) {
            console.error('Error deactivating user:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Hubo un problema al actualizar el estado del usuario',
                duration: 2000,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const updateUser = useCallback(async (userId: number, userData: Partial<User>) => {
        setLoading(true)
        try {
            await requestJson(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            toast({
                variant: 'success',
                title: 'Éxito',
                description: `El usuario ${userData.firstName} ${userData.lastName} se ha actualizado correctamente`,
                duration: 2000,
            })
        } catch (error) {
            console.error('Error al actualizar el usuario:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Hubo un problema al actualizar el usuario',
                duration: 2000,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return { user, loading, fetchUser, registerUser, updateStatusUser, updateUser }
}
