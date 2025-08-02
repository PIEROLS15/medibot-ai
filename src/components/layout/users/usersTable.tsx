"use client"

import { useState, useEffect } from "react"
import { User } from "@/types/user"
import EditarUsuarioModal from "@/components/layout/users/userEditModal"
import DetallesUsuarioModal from "@/components/layout/users/userDetailsModal"
import UsuariosTableDesktop from "@/components/layout/users/userTableDesktop"
import UsuariosTableMobile from "@/components/layout/users/userTableMobile"
import UserStatusDialog from "./userStatusDialog"

interface UsersTableProps {
    user: User[]
    searchTerm: string
    onUserUpdate?: (updatedUser: User) => void
}

export default function UsuariosTable({ user, searchTerm, onUserUpdate }: UsersTableProps) {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    // Inicializa usuarios desde props
    useEffect(() => {
        setUsers(user)
    }, [user])

    // Actualiza filteredUsers cuando cambian usuarios o searchTerm
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredUsers(users)
            return
        }

        const termLower = searchTerm.toLowerCase()
        const filtered = users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(termLower) ||
                user.lastName.toLowerCase().includes(termLower) ||
                user.email.toLowerCase().includes(termLower) ||
                user.role.name.toLowerCase().includes(termLower)
        )
        setFilteredUsers(filtered)
    }, [searchTerm, users])

    const handleEditUsuario = (user: User) => {
        setSelectedUser(user)
        setShowEditModal(true)
    }

    const handleViewDetails = (user: User) => {
        setSelectedUser(user)
        setShowDetailsModal(true)
    }

    const handleStatusUser = (user: User) => {
        setSelectedUser(user)
        setShowStatusModal(true)
    }

    const handleStatusUpdated = (userUpdated: User) => {
        const updatedUsuarios = users.map((u) =>
            u.id === userUpdated.id ? userUpdated : u
        )
        setUsers(updatedUsuarios)

        if (onUserUpdate) {
            onUserUpdate(userUpdated)
        }
    }

    const handleUsuarioActualizado = (usuarioActualizado: User) => {
        const updatedUsuarios = users.map((u) =>
            u.id === usuarioActualizado.id ? usuarioActualizado : u
        )
        setUsers(updatedUsuarios)

        if (onUserUpdate) {
            onUserUpdate(usuarioActualizado)
        }
    }

    return (
        <div className="w-full">

            {/* Vista de tabla para desktop */}
            <UsuariosTableDesktop
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleStatusUser}
            />

            {/* Vista de cards para móvil */}
            <UsuariosTableMobile
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleStatusUser}
            />

            {/* Modales */}
            <EditarUsuarioModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                user={selectedUser}
                onUserUpdated={handleUsuarioActualizado}
            />

            <UserStatusDialog
                open={showStatusModal}
                onOpenChange={setShowStatusModal}
                user={selectedUser}
                onStatusUpdated={handleStatusUpdated}
            />

            <DetallesUsuarioModal
                open={showDetailsModal}
                onOpenChange={setShowDetailsModal}
                user={selectedUser}
            />
        </div>
    )
}
