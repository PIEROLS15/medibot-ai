'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ThemeToggle from '@/components/ui/themeToggle'
import LoginForm from './ui/loginForm'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LoginPage = () => {
    const { status } = useSession()
    const router = useRouter()
    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || '/default_logo.png'

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

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
                <CardTitle className='text-2xl font-bold text-gray-900 dark:text-white'>Iniciar Sesión</CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                    Ingrese sus credenciales para acceder al sistema
                </CardDescription>
            </CardHeader>
            <div className='flex justify-center mt-4'>
                <ThemeToggle />
            </div>
            <CardContent>
                <LoginForm />
                <div className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
                    <p>
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href='/register'
                            className='text-primary hover:text-secondary transition-colors font-medium dark:text-primary dark:hover:text-secondary'
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoginPage
