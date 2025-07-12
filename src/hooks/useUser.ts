import { useState, useEffect, useCallback } from "react"
import { User } from "@/types/user"
import { useToast } from "@/hooks/use-toast"

export function useUser() {
    const [user, setUser] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchUser = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/users/`)
            if (!res.ok) throw new Error("Error al obtener el usuario")
            const data = await res.json()
            if (res.ok) {
                setUser(data)
            } else {
                toast({
                    title: "Error",
                    description: "No se pudieron obtener los usuarios",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.error("Error fetching user:", error)
            toast({
                title: "Error",
                description: "Hubo un problema al cargar los usuarios",
                duration: 3000,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    const registerUser = useCallback(async (userData: Omit<User, 'id'>) => {
        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            if (!res.ok) throw new Error("Error al registrar el usuario")
            const data = await res.json()
            if (res.ok) {
                toast({
                    title: "Éxito",
                    description: `El usuario ${userData.firstName + " " + userData.lastName} se ha creado correctamente`,
                    duration: 3000,
                })
            } else {
                toast({
                    title: "Error",
                    description: data.message || "No se pudo registrar el usuario",
                    duration: 3000,
                })
            }
        } catch (error) {
            console.error("Error registering user:", error)
            toast({
                title: "Error",
                description: "Hubo un problema al registrar el usuario",
                duration: 3000,
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return { user, loading, fetchUser, registerUser }
}