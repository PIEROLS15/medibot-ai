'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ThemeToggle from '@/components/ui/themeToggle'
import { Loader2, Mail, User } from 'lucide-react'
import Link from 'next/link'
import GoogleButton from '@/components/ui/googleButton'
import Image from 'next/image'
import AuthDivider from '../ui/authDivider'
import TextField from '../ui/textField'
import PasswordField from '../ui/passwordField'
import { useRegisterForm } from '@/hooks/useRegisterForm'

export default function RegistroForm() {
    const {
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
    } = useRegisterForm()

    return (
        <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800'>
            <CardHeader className='text-center pb-6'>
                <div className='flex items-center justify-center'>
                    <Image
                        src={logoPath}
                        alt='Medibot AI Logo'
                        width={128}
                        height={128}
                        className='rounded-full'
                        priority
                    />
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
                        <TextField
                            id='firstName'
                            name='firstName'
                            type='text'
                            label='Nombres'
                            placeholder='Juan Carlos'
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                            icon={<User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />}
                        />

                        <TextField
                            id='lastName'
                            name='lastName'
                            type='text'
                            label='Apellidos'
                            placeholder='Pérez Gómez'
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                            icon={<User className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />}
                        />
                    </div>

                    <TextField
                        id='email'
                        name='email'
                        type='email'
                        label='Correo Electrónico'
                        placeholder='farmaceutico@ejemplo.com'
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={<Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />}
                    />

                    <PasswordField
                        id='password'
                        label='Contraseña'
                        value={formData.password}
                        onChange={(value) => setFormData((prev) => ({ ...prev, password: value }))}
                        showPassword={showPassword}
                        onToggleVisibility={() => setShowPassword(!showPassword)}
                        error={errors.password || undefined}
                    />
                    {!errors.password && (
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Mínimo 6 caracteres</p>
                    )}

                    <PasswordField
                        id='confirmPassword'
                        label='Confirmar Contraseña'
                        value={formData.confirmPassword}
                        onChange={(value) => setFormData((prev) => ({ ...prev, confirmPassword: value }))}
                        showPassword={showConfirmPassword}
                        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                        error={errors.confirmPassword}
                    />

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
                    <AuthDivider />

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
