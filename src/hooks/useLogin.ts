import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { loginSchema } from '@/lib/validations/auth'
import { useToast } from '@/hooks/use-toast'

interface Errors {
    [key: string]: string | undefined
}

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const router = useRouter()
    const { toast } = useToast()

    const handleLogin = async (formData: { email: string; password: string }) => {
        try {
            loginSchema.parse(formData)
            setErrors({})
            setIsLoading(true)

            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (res?.ok) {
                router.push('/dashboard')
            } else {
                toast({
                    title: 'Error de autenticación',
                    description:
                        res?.error || 'Email o contraseña incorrectos. Verifica tus credenciales.',
                    variant: 'destructive',
                    duration: 4000,
                })
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
                    title: 'Error inesperado',
                    description: 'Ocurrió un problema al iniciar sesión. Intenta nuevamente.',
                    duration: 4000,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }


    return {
        isLoading,
        errors,
        handleLogin,
    }
}
