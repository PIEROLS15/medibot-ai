'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ThemeToggle from '@/components/ui/themeToggle'
import { Loader2, Mail, Lock, Pill, User, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import GoogleButton from '@/components/ui/buttonGoogle'
import { useLoginGoogle } from '@/hooks/useLoginGoogle'
import { useRegister } from '@/hooks/useRegister'

export default function RegistroForm() {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleRegister(formData)
    }

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
            <div className='flex justify-center mt-4'>
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

                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <Separator className='w-full' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>O</span>
                        </div>
                    </div>

                    <GoogleButton
                        isLoading={isLoadingGoogle}
                        onClick={handleGoogleSignIn}
                        label='Registrarse con Google'
                    />

                </div>

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
