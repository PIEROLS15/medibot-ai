"use client"

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useLoginGoogle } from '@/hooks/useLoginGoogle'
import { useRegister } from '@/hooks/useRegister'

export function useRegisterForm() {
    const { handleGoogleSignIn, isLoadingGoogle } = useLoginGoogle()
    const { isLoading, errors, handleRegister } = useRegister()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || '/default_logo.png'

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegister(formData)
    }

    return {
        formData,
        setFormData,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        logoPath,
        handleGoogleSignIn,
        isLoadingGoogle,
        isLoading,
        errors,
        handleChange,
        handleSubmit,
    }
}
