"use client"

import { useState, type FormEvent } from 'react'
import { useLoginGoogle } from '@/hooks/useLoginGoogle'
import { useLogin } from '@/hooks/useLogin'

export function useLoginForm() {
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const { handleGoogleSignIn, isLoadingGoogle } = useLoginGoogle()
    const { isLoading, errors, handleLogin } = useLogin()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleLogin(formData)
    }

    return {
        showForgotPassword,
        setShowForgotPassword,
        formData,
        setFormData,
        showPassword,
        setShowPassword,
        handleGoogleSignIn,
        isLoadingGoogle,
        isLoading,
        errors,
        handleSubmit,
    }
}
