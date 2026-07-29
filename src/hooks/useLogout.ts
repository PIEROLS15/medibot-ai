"use client"

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function useLogout() {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await signOut({ redirect: false })
            router.push('/')
            setTimeout(() => setIsLoggingOut(false), 1000)
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            setIsLoggingOut(false)
        }
    }

    return { isLoggingOut, handleLogout }
}
