import { useState } from 'react'
import { z } from 'zod'
import { registerSchema } from '@/lib/validations/auth'
import { useToast } from '@/hooks/use-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { RegisterUser } from '@/types/user'

interface Errors {
    [key: string]: string | undefined
}

export const useRegister = () => {
    const { toast } = useToast()
    const router = useRouter()
    const { registerUser } = useUser()

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const [isSuccess, setIsSuccess] = useState(false)

    const handleRegister = async (formData: RegisterUser) => {
        try {
            registerSchema.parse(formData)
            setErrors({})
            setIsLoading(true)

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            }

            const success = await registerUser(userData)
            if (!success) return

            const signInRes = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (signInRes?.ok) {
                router.push('/dashboard')
            } else {
                toast({
                    variant: 'success',
                    title: 'Cuenta creada',
                    description: 'Por favor, inicia sesión con tus credenciales.',
                    duration: 2000,
                })
                router.push('/login')
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const formattedErrors: Errors = {}
                err.errors.forEach((error) => {
                    formattedErrors[error.path[0]] = error.message
                })
                setErrors(formattedErrors)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error del servidor',
                    description:
                        err instanceof Error
                            ? err.message
                            : 'Error al registrar la cuenta. Intente nuevamente.',
                    duration: 4000,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegisterModal = async (formData: RegisterUser) => {

        try {
            registerSchema.parse(formData)

            setErrors({})
            setIsLoading(true)

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            }

            await registerUser(userData)

            setIsSuccess(true)

        } catch (err) {
            if (err instanceof z.ZodError) {
                const formattedErrors: Errors = {}
                err.errors.forEach((error) => {
                    formattedErrors[error.path[0]] = error.message
                })
                setErrors(formattedErrors)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        isSuccess,
        errors,
        handleRegister,
        handleRegisterModal
    }
}
