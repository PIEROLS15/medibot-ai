"use client"

import React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"

interface Usuario {
    id: string
    nombres: string
    apellidos: string
    email: string
    rol: string
    activo: boolean
    fechaRegistro: string
    ultimoAcceso: string | null
}

interface EditarUsuarioModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    usuario: User | null
    onUsuarioActualizado: (usuario: User) => void
}

export default function EditarUsuarioModal({
    open,
    onOpenChange,
    usuario,
    onUsuarioActualizado,
}: EditarUsuarioModalProps) {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        rol: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    React.useEffect(() => {
        if (usuario) {
            setFormData({
                nombres: usuario.firstName,
                apellidos: usuario.lastName,
                email: usuario.email,
                rol: usuario.role.name,
            })
        }
    }, [usuario])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        if (!formData.nombres.trim()) return "El nombre es requerido"
        if (!formData.apellidos.trim()) return "Los apellidos son requeridos"
        if (!formData.email.trim()) return "El correo electrónico es requerido"
        if (!formData.rol) return "El rol es requerido"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) return "El correo electrónico no es válido"

        return ""
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = validateForm()
        if (validationError) {
            toast({
                variant: "destructive",
                title: "Error de validación",
                description: validationError,
            })
            return
        }

        setIsLoading(true)

        try {
            // Simulación de actualización
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const usuarioActualizado = {
                ...usuario!,
                ...formData,
            }

            onUsuarioActualizado(usuarioActualizado)

            toast({
                variant: "success",
                title: "Usuario actualizado",
                description: `Los datos de ${formData.nombres} ${formData.apellidos} han sido actualizados correctamente.`,
            })

            onOpenChange(false)
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error del servidor",
                description: "Error al actualizar el usuario. Intente nuevamente.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onOpenChange(false)
        }
    }

    if (!usuario) return null

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md w-[95vw] max-w-lg mx-auto dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Editar Usuario</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Modifique la información del usuario seleccionado.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombres" className="text-gray-700 dark:text-gray-300">
                                Nombres
                            </Label>
                            <Input
                                id="nombres"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                className="dark:bg-gray-800 dark:border-gray-700"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="apellidos" className="text-gray-700 dark:text-gray-300">
                                Apellidos
                            </Label>
                            <Input
                                id="apellidos"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                className="dark:bg-gray-800 dark:border-gray-700"
                                required
                            />
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
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rol" className="text-gray-700 dark:text-gray-300">
                            Rol
                        </Label>
                        <Select value={formData.rol} onValueChange={(value) => handleSelectChange("rol", value)} required>
                            <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="Farmacéutico">Farmacéutico</SelectItem>
                            </SelectContent>
                        </Select>
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
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
