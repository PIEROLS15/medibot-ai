"use client"

import { useState } from "react"
import Header from '@/components/layout/header'
import { UserPlus } from 'lucide-react'
import RegistroUsuarioModal from '@/components/auth/register/registerUserModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import UsuariosTable from "@/components/layout/users/usersTable"
import { useUser } from '@/hooks/useUser'

const Users = () => {
    const [showRegistroModal, setShowRegistroModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { user } = useUser()

    return (
        <>
            <div className="space-y-6 pt-10">
                <Header
                    title="Gestión de Usuarios"
                    description="Administre los usuarios del sistema"
                    iconoButton={UserPlus}
                    textButton="Registrar Usuario"
                    onOpenModal={() => setShowRegistroModal(true)}
                />

                <Card className="dark:bg-gray-900/80 dark:border-gray-800">
                    <CardHeader className="pb-3">
                        <CardTitle>Usuarios del Sistema</CardTitle>
                        <CardDescription>Lista de todos los usuarios registrados en el sistema</CardDescription>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <Input
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UsuariosTable user={user} searchTerm={searchTerm} />
                    </CardContent>
                </Card>

                <RegistroUsuarioModal open={showRegistroModal} onOpenChange={setShowRegistroModal} />

            </div>
        </>
    )
}

export default Users