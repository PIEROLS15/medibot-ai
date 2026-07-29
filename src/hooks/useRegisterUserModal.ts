"use client"

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRegister } from '@/hooks/useRegister'

export function useRegisterUserModal(onOpenChange: (open: boolean) => void) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { isSuccess, isLoading, errors, handleRegisterModal } = useRegister()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegisterModal(formData)
    }

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            })
            setShowPassword(false)
            setShowConfirmPassword(false)
            onOpenChange(false)
        }
    }

    const handleSuccessAcknowledge = () => {
        handleClose()
        window.location.reload()
    }

    return {
        formData,
        setFormData,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        isSuccess,
        isLoading,
        errors,
        handleChange,
        handleSubmit,
        handleClose,
        handleSuccessAcknowledge,
    }
}
