"use client"

import { User } from "@/types/user"
import EditarUsuarioModal from "@/components/features/users/editUserModal"
import DetallesUsuarioModal from "@/components/features/users/userDetailsModal"
import UsuariosTableDesktop from "@/components/features/users/userTableDesktop"
import UsuariosTableMobile from "@/components/features/users/userTableMobile"
import UserStatusDialog from "@/components/features/users/userStatusDialog"
import { useUsersTable } from '@/hooks/useUsersTable'

interface UsersTableProps {
    users: User[]
    searchTerm: string
    onUserUpdate?: (updatedUser: User) => void
}

const UsersTable = ({ users: initialUsers, searchTerm, onUserUpdate }: UsersTableProps) => {
    const {
        filteredUsers,
        selectedUser,
        setSelectedUser,
        showEditModal,
        setShowEditModal,
        showStatusModal,
        setShowStatusModal,
        showDetailsModal,
        setShowDetailsModal,
        updateUserInState,
    } = useUsersTable({ users: initialUsers, searchTerm, onUserUpdate })

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

    return (
        <div className="w-full">
            <UsuariosTableDesktop
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleStatusUser}
            />

            <UsuariosTableMobile
                filteredUsers={filteredUsers}
                onViewDetails={handleViewDetails}
                onEditUser={handleEditUsuario}
                onToggleActive={handleStatusUser}
            />

            <EditarUsuarioModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                user={selectedUser}
                onUserUpdated={updateUserInState}
            />

            <UserStatusDialog
                open={showStatusModal}
                onOpenChange={setShowStatusModal}
                user={selectedUser}
                onStatusUpdated={updateUserInState}
            />

            <DetallesUsuarioModal
                open={showDetailsModal}
                onOpenChange={setShowDetailsModal}
                user={selectedUser}
            />
        </div>
    )
}

export default UsersTable
