'use client'

import type React from "react"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

            <ForgotPasswordModal open={showForgotPassword} onOpenChange={setShowForgotPassword} />
        </>
    )
}

export default LoginForm