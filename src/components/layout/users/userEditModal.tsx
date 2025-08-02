import React, { useState, useEffect } from "react"
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
import { useUser } from "@/hooks/useUser"
import { useRoles } from "@/hooks/useRoles"
import { getNameRoleUser } from '@/utils/user'

interface EditarUsuarioModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
    onUserUpdated: (user: User) => void
}

export default function EditarUsuarioModal({
    open,
    onOpenChange,
    user,
    onUserUpdated,
}: EditarUsuarioModalProps) {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        rol: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { updateUser } = useUser()
    const { roles, fetchRoles } = useRoles()

    // Cargar roles al montar el componente
    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    React.useEffect(() => {
        if (user) {
            setFormData({
                nombres: user.firstName,
                apellidos: user.lastName,
                email: user.email,
                rol: user.role.name,
            })
        }
    }, [user])

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
            const selectedRole = roles.find((role) => role.name === formData.rol)

            if (!selectedRole) {
                toast({
                    variant: "destructive",
                    title: "Error de rol",
                    description: "El rol seleccionado no es válido.",
                });
                return;
            }
            const roleId = selectedRole.id;

            await updateUser(user!.id, {
                firstName: formData.nombres,
                lastName: formData.apellidos,
                email: formData.email,
                roleId: roleId,
            })

            const userUpdate: User = {
                ...user!,
                firstName: formData.nombres,
                lastName: formData.apellidos,
                email: formData.email,
                role: selectedRole
            }

            onUserUpdated(userUpdate)

            onOpenChange(false)
        } catch (err) {
            console.error('Error al actualizar el usuario:', err)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onOpenChange(false)
        }
    }

    if (!user) return null

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
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                        {getNameRoleUser(role.name)}
                                    </SelectItem>
                                ))}
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
