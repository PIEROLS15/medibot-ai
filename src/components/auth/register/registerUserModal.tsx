"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"
import { z } from "zod"
import { useUser } from "@/hooks/useUser"

const registrationSchema = z.object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "Los apellidos son obligatorios"),
    email: z
        .string()
        .email("El correo electrónico no es válido")
        .min(1, "El correo electrónico es obligatorio"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .nonempty("La contraseña es obligatoria"),
    confirmPassword: z.string().min(1, "Confirmar contraseña es obligatorio"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

interface RegistroUsuarioModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface Errors {
    [key: string]: string | undefined
}

export default function RegistroUsuarioModal({ open, onOpenChange }: RegistroUsuarioModalProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const { registerUser } = useUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            registrationSchema.parse(formData)

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


    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            })
            setShowPassword(false)
            setShowConfirmPassword(false)
            setIsSuccess(false)
            setErrors({})
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md w-[95vw] max-w-lg mx-auto dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {isSuccess ? "Usuario Registrado" : "Registrar Nuevo Usuario"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        {isSuccess
                            ? "El usuario ha sido registrado exitosamente en el sistema."
                            : "Complete el formulario para registrar un nuevo usuario farmacéutico."}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="text-center py-6">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Registro Exitoso</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            El usuario {formData.firstName} {formData.lastName} ha sido registrado correctamente con el rol de
                            Farmacéutico.
                        </p>
                        <Button onClick={handleClose} className="bg-primary hover:bg-secondary text-white">
                            Entendido
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
                                    Nombres
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
                                    Apellidos
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="dark:bg-gray-800 dark:border-gray-700"

                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pr-10 dark:bg-gray-800 dark:border-gray-700"

                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                                Confirmar Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pr-10 dark:bg-gray-800 dark:border-gray-700"

                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-secondary" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Registrar Usuario"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
