'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import ForgotPasswordModal from '@/components/auth/forgotPasswordModal'
import GoogleButton from '@/components/ui/buttonGoogle'
import { useLoginGoogle } from '@/hooks/useLoginGoogle'
import { useLogin } from '@/hooks/useLogin'

const LoginForm = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const { handleGoogleSignIn, isLoadingGoogle } = useLoginGoogle()
    const { isLoading, errors, handleLogin } = useLogin()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleLogin(formData)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='space-y-4'>
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
                            placeholder='Ingresa tu correo electrónico'
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className='pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                        />
                    </div>
                    {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
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
                            placeholder='Ingresa tu contraseña'
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
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
                    {errors.password && <p className='text-sm text-red-500'>{errors.password}</p>}
                </div>

                <div className='flex justify-end'>
                    <button
                        type='button'
                        onClick={() => setShowForgotPassword(true)}
                        className='text-sm text-primary hover:text-secondary transition-colors dark:text-primary dark:hover:text-secondary'
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </div>

                <Button
                    type='submit'
                    className='w-full bg-primary hover:bg-secondary text-white font-medium py-2.5 dark:bg-primary dark:hover:bg-secondary'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Iniciando sesión...
                        </>
                    ) : (
                        'Iniciar Sesión'
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
                    label='Iniciar sesión con Google'
                />
            </div>

            <ForgotPasswordModal open={showForgotPassword} onOpenChange={setShowForgotPassword} />
        </>
    )
}

export default LoginForm
