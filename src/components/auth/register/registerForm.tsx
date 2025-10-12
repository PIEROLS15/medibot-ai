'use client'

import type React from 'react'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
import ThemeToggle from "@/components/ui/themeToggle"
import { Loader2, Mail, Lock, Pill, User, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { registerSchema } from '@/utils/user'
import { useUser } from '@/hooks/useUser'

interface Errors {
    [key: string]: string | undefined
}

export default function RegistroForm() {
    const router = useRouter()
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const { registerUser } = useUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

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

            // Iniciar sesión automáticamente después del registro
            const signInRes = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })

            if (signInRes?.ok) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                })

                router.push('/dashboard')
            } else {
                toast({
                    variant: 'success',
                    title: 'Cuenta creada',
                    description: 'Por favor, inicia sesión con tus credenciales.',
                    duration: 3000,
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
                    description: err instanceof Error ? err.message : 'Error al registrar la cuenta. Intente nuevamente.',
                    duration: 4000,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // const handleGoogleSignIn = async () => {
    //     setIsLoadingGoogle(true)

    //     try {
    //         // Iniciar sesión con Google usando NextAuth
    //         const result = await signIn('google', {
    //             redirect: false,
    //             callbackUrl: '/dashboard',
    //         })

    //         if (result?.ok) {
    //             toast({
    //                 title: '¡Registro exitoso!',
    //                 description: 'Tu cuenta ha sido creada con Google. Redirigiendo...',
    //                 duration: 3000,
    //             })
    //             router.push('/dashboard')
    //         } else {
    //             throw new Error('Error al registrarse con Google')
    //         }
    //     } catch (err) {
    //         void err
    //         toast({
    //             variant: 'destructive',
    //             title: 'Error de autenticación',
    //             description: 'No se pudo completar el registro con Google. Intente nuevamente.',
    //             duration: 4000,
    //         })
    //     } finally {
    //         setIsLoadingGoogle(false)
    //     }
    // }

    return (
        <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800'>
            <CardHeader className='text-center pb-6'>
                <div className='mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4'>
                    <Pill className='w-6 h-6 text-white' />
                </div>
                <CardTitle className='text-2xl font-bold text-gray-900 dark:text-white'>Crear Cuenta</CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                    Complete el formulario para registrarse en el sistema
                </CardDescription>
            </CardHeader>
            <div className="flex justify-center mt-4">
                <ThemeToggle />
            </div>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='firstName' className='text-gray-700 dark:text-gray-300 font-medium'>
                                Nombres
                            </Label>
                            <div className='relative'>
                                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                                <Input
                                    id='firstName'
                                    name='firstName'
                                    type='text'
                                    placeholder='Juan Carlos'
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className='pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                                />
                            </div>
                            {errors.firstName && (
                                <p className='text-sm text-red-500'>{errors.firstName}</p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='lastName' className='text-gray-700 dark:text-gray-300 font-medium'>
                                Apellidos
                            </Label>
                            <div className='relative'>
                                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                                <Input
                                    id='lastName'
                                    name='lastName'
                                    type='text'
                                    placeholder='Pérez Gómez'
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className='pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                                />
                            </div>
                            {errors.lastName && (
                                <p className='text-sm text-red-500'>{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='email' className='text-gray-700 dark:text-gray-300 font-medium'>
                            Correo Electrónico
                        </Label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                placeholder='farmaceutico@ejemplo.com'
                                value={formData.email}
                                onChange={handleChange}
                                className='pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                            />
                        </div>
                        {errors.email && (
                            <p className='text-sm text-red-500'>{errors.email}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='password' className='text-gray-700 dark:text-gray-300 font-medium'>
                            Contraseña
                        </Label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                            <Input
                                id='password'
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                value={formData.password}
                                onChange={handleChange}
                                className='pl-10 pr-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className='text-sm text-red-500'>{errors.password}</p>
                        )}
                        {!errors.password && (
                            <p className='text-xs text-gray-500 dark:text-gray-400'>Mínimo 6 caracteres</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='confirmPassword' className='text-gray-700 dark:text-gray-300 font-medium'>
                            Confirmar Contraseña
                        </Label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />
                            <Input
                                id='confirmPassword'
                                name='confirmPassword'
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className='pl-10 pr-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className='text-sm text-red-500'>{errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button
                        type='submit'
                        className='w-full bg-primary hover:bg-secondary text-white font-medium py-2.5 dark:bg-primary dark:hover:bg-secondary'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Creando cuenta...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </Button>
                </form>

                {/* <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <Separator className='w-full' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>O continuar con</span>
                        </div>
                    </div>

                    <Button
                        type='button'
                        variant='outline'
                        className='w-full mt-4 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent'
                        onClick={handleGoogleSignIn}
                        disabled={isLoadingGoogle}
                    >
                        {isLoadingGoogle ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Conectando...
                            </>
                        ) : (
                            <>
                                <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                                    <path
                                        fill='currentColor'
                                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                    />
                                    <path
                                        fill='currentColor'
                                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                    />
                                </svg>
                                Registrarse con Google
                            </>
                        )}
                    </Button>
                </div> */}

                <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <Link
                            href='/'
                            className='text-primary hover:text-secondary transition-colors font-medium dark:text-primary dark:hover:text-secondary'
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
