"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"
import EditarUsuarioModal from "@/components/layout/users/userEditModal"
import DetallesUsuarioModal from "@/components/layout/users/userDetailsModal"
import UsuariosTableDesktop from "@/components/layout/users/userTableDesktop"
import UsuariosTableMobile from "@/components/layout/users/userTableMobile"

interface UsersTableProps {
    user: User[]
    searchTerm: string
}

export default function UsuariosTable({ user, searchTerm }: UsersTableProps) {
    const [usuarios, setUsuarios] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const { toast } = useToast()

    // Filtrar usuarios cuando cambia el término de búsqueda
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(user)
            return
        }

        const termLower = searchTerm.toLowerCase()
        const filtered = user.filter(
            (usuario) =>
                usuario.firstName.toLowerCase().includes(termLower) ||
                usuario.lastName.toLowerCase().includes(termLower) ||
                usuario.email.toLowerCase().includes(termLower)
        )
        setFilteredUsers(filtered)
    }, [searchTerm, user])

    const handleEditUsuario = (user: User) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleViewDetails = (user: User) => {
        setSelectedUser(user)
        setShowDetailsModal(true)
    }

    const handleToggleActive = (user: User) => {
        // Aquí puedes implementar la lógica para activar/desactivar usuario
        console.log('Toggle active for user:', user.id)
        toast({
            title: `Usuario ${user.isActive ? 'desactivado' : 'activado'}`,
            description: `${user.firstName} ${user.lastName} ha sido ${user.isActive ? 'desactivado' : 'activado'}.`,
        })
    }

    const handleUsuarioActualizado = (usuarioActualizado: User) => {
        const updatedUsuarios = usuarios.map((u) => (u.id === usuarioActualizado.id ? usuarioActualizado : u))
        setUsuarios(updatedUsuarios)
        setFilteredUsers(
            updatedUsuarios.filter((u) => {
                if (!searchTerm.trim()) return true
                const termLower = searchTerm.toLowerCase()
                return (
                    u.firstName.toLowerCase().includes(termLower) ||
                    u.lastName.toLowerCase().includes(termLower) ||
                    u.email.toLowerCase().includes(termLower) ||
                    u.role.name.toLowerCase().includes(termLower)
                )
            }),
        )
    }

    return (
        <div className="w-full">
            {/* Vista de tabla para desktop */}
            <UsuariosTableDesktop
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleToggleActive}
            />

            {/* Vista de cards para móvil */}
            <UsuariosTableMobile
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleToggleActive}
            />

            {/* Modales */}
            {/* <EditarUsuarioModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                usuario={setSelectedUser}
                onUsuarioActualizado={handleUsuarioActualizado}
            /> */}

            <DetallesUsuarioModal open={showDetailsModal} onOpenChange={setShowDetailsModal} user={selectedUser} />
        </div>
    )
}