"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Shield, Calendar, Activity } from "lucide-react"
import { User } from "@/types/user"
import { getRoleUser, getStatusUser, getNameRoleUser, getInitials } from '@/utils/user'
import { formatDate } from '@/utils/base'

interface DetailsUserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
}

export default function DetallesUsuarioModal({ open, onOpenChange, user }: DetailsUserModalProps) {
    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-[95vw] max-w-lg mx-auto dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Detalles del Usuario</DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        Información completa del usuario seleccionado.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar y información básica */}
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4">
                            <AvatarFallback className="bg-primary text-white text-xl">
                                {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getRoleUser(user.role.name)}>
                                {getNameRoleUser(user.role.name)}
                            </Badge>
                            <Badge variant={getStatusUser(user.isActive)}>
                                {user.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>

                    <Separator className="dark:border-gray-700" />

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Correo Electrónico</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Rol del Sistema</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Fecha de Registro</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Estado de la Cuenta</p>
                                <p
                                    className={`text-sm ${user.isActive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                                        }`}
                                >
                                    {user.isActive ? "Cuenta activa y operativa" : "Cuenta desactivada"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="dark:border-gray-700" />

                    {/* Estadísticas adicionales */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Estadísticas</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">12</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Recomendaciones</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">45</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Días activo</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-secondary text-white">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}
