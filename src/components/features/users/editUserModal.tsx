import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"
import { useUser } from "@/hooks/useUser"
import { useRoles } from "@/hooks/useRoles"
import UserEditFields from './userEditFields'

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

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    useEffect(() => {
        if (user) {
            setFormData({
                nombres: user.firstName,
                apellidos: user.lastName,
                email: user.email,
                rol: user.role.name,
            })
        }
    }, [user])

    const handleChange = (name: string, value: string) => {
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

    const handleSubmit = async (e: FormEvent) => {
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
                })
                return
            }
            const roleId = selectedRole.id

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
        } finally {
            setIsLoading(false)
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
                    <UserEditFields
                        formData={formData}
                        roles={roles}
                        onChange={handleChange}
                        onRoleChange={(value) => handleChange('rol', value)}
                    />

                    <DialogFooter className="pt-4 gap-4 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-transparent"
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-secondary text-white" disabled={isLoading}>
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
