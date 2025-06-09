'use client'

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import ForgotPasswordModal from "@/components/auth/forgotPasswordModal"
import { useActionState } from "react"
import { authenticate } from "@/actions"
import { useRouter } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
    email: z.string().min(1, "El correo es obligatorio").email("Correo no válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [state, dispatch] = useActionState(authenticate, undefined)
    const router = useRouter()
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    useEffect(() => {
        if (state === 'Success') {
            router.replace('/dashboard')
        }
    }, [state, router])

    const handleValidation = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }

        const result = loginSchema.safeParse(data)
        if (!result.success) {
            e.preventDefault()
            const fieldErrors = result.error.flatten().fieldErrors
            setErrors({
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            })
        } else {
            setErrors({})
        }
    }

    return (
        <>
            <form action={dispatch} onSubmit={handleValidation} className="space-y-4">

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
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
                    <div className="min-h-[20px]">
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>
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
    );
}

export default LoginForm;