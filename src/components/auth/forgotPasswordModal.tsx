"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle } from "lucide-react"

interface ForgotPasswordModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ForgotPasswordModal = ({ open, onOpenChange }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // Simulación de envío de email
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setError("Por favor ingrese un correo electrónico válido.")
                return
            }

            setIsSuccess(true)
        } catch (err) {
            void err
            setError("Error al enviar el correo. Intente nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setIsSuccess(false)
        setError("")
        setIsLoading(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Recuperar Contraseña</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Ingrese su correo electrónico y le enviaremos las instrucciones para restablecer su contraseña.
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="text-center py-6">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Correo Enviado</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Se han enviado las instrucciones de recuperación a <span className="font-medium">{email}</span>
                        </p>
                        <Button onClick={handleClose} className="bg-primary hover:bg-secondary text-white">
                            Entendido
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="recovery-email" className="text-gray-700 dark:text-gray-300 font-medium">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    id="recovery-email"
                                    type="email"
                                    placeholder="farmaceutico@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary hover:bg-secondary text-white" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Instrucciones"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ForgotPasswordModal;