"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserPlus, Loader2, CheckCircle } from "lucide-react"

interface DatosCliente {
    tipoId: string
    numeroId: string
    nombre: string
    edad: string
}

interface RegistroClienteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    datosCliente: DatosCliente
}

export default function RegistroClienteModal({ open, onOpenChange, datosCliente }: RegistroClienteModalProps) {
    const [isRegistering, setIsRegistering] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleRegistro = async () => {
        setIsRegistering(true)

        try {
            // Simulación de registro
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setIsSuccess(true)
        } catch (error) {
            console.error("Error al registrar cliente:", error)
        } finally {
            setIsRegistering(false)
        }
    }

    const handleClose = () => {
        setIsSuccess(false)
        onOpenChange(false)
    }

    const mapTipoId = (tipo: string): string => {
        const tipos: Record<string, string> = {
            cedula: "Cédula",
            pasaporte: "Pasaporte",
            extranjeria: "Cédula de Extranjería",
        }
        return tipos[tipo] || tipo
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md w-[95vw] max-w-lg mx-auto dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {isSuccess ? "Cliente Registrado" : "Cliente No Registrado"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        {isSuccess
                            ? "El cliente ha sido registrado exitosamente en el sistema."
                            : "Este cliente no está registrado en el sistema. ¿Desea registrarlo ahora?"}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="text-center py-6">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Registro Exitoso</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            El cliente {datosCliente.nombre} ha sido registrado correctamente.
                        </p>
                        <Button onClick={handleClose} className="bg-primary hover:bg-secondary text-white">
                            Entendido
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="border rounded-md p-4 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Datos del Cliente</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{datosCliente.nombre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Identificación:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {mapTipoId(datosCliente.tipoId)} {datosCliente.numeroId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Edad:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{datosCliente.edad} años</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                                disabled={isRegistering}
                            >
                                No, Omitir
                            </Button>
                            <Button
                                type="button"
                                className="flex-1 bg-primary hover:bg-secondary text-white"
                                onClick={handleRegistro}
                                disabled={isRegistering}
                            >
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Registrar Cliente
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
