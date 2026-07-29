"use client"

import { useState, type FormEvent } from 'react'

export function useForgotPasswordModal(onOpenChange: (open: boolean) => void) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setError('Por favor ingrese un correo electrónico válido.')
                return
            }

            setIsSuccess(true)
        } catch {
            setError('Error al enviar el correo. Intente nuevamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail('')
        setIsSuccess(false)
        setError('')
        setIsLoading(false)
        onOpenChange(false)
    }

    return { email, setEmail, isLoading, isSuccess, error, handleSubmit, handleClose }
}
