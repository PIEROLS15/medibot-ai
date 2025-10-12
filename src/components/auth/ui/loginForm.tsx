'use client'

import type React from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import ForgotPasswordModal from "@/components/auth/forgotPasswordModal"
import { useRouter } from "next/navigation"


const LoginForm = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
    const { toast } = useToast()


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        setIsLoading(false)

        if (res?.ok) {
            toast({
                title: "¡Bienvenido!",
                description: `Has iniciado sesión correctamente.`,
                duration: 3000,
            })

            // Puedes redirigir según el rol si quieres, usando session.user.role
            router.push("/dashboard") // O tu ruta destino
        } else {
            console.log("Error en la autenticación:", res)
            toast({
                title: "Error de autenticación",
                description: res?.error || "Email o contraseña incorrectos. Verifica tus credenciales.",
                variant: "destructive",
                duration: 4000,
            })
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
        <>
            <form onSubmit={handleLogin} className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                        Correo Electrónico
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        {/* {errors.email && <p className="text-sm text-red-500">{errors.email}</p>} */}
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                        Contraseña
                    </Label>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />

                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {/* <div className="min-h-[20px]">
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div> */}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:text-secondary transition-colors dark:text-primary dark:hover:text-secondary"
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-secondary text-white font-medium py-2.5 dark:bg-primary dark:hover:bg-secondary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Iniciando sesión...
                        </>
                    ) : (
                        "Iniciar Sesión"
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
                            Iniciar sesión con Google
                        </>
                    )}
                </Button>
            </div> */}
            <ForgotPasswordModal open={showForgotPassword} onOpenChange={setShowForgotPassword} />
        </>
    )
}

export default LoginForm
