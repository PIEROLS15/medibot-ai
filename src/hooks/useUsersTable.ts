"use client"

import { useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/user'

interface UseUsersTableParams {
    users: User[]
    searchTerm: string
    onUserUpdate?: (updatedUser: User) => void
}

export function useUsersTable({ users: initialUsers, searchTerm, onUserUpdate }: UseUsersTableParams) {
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const filteredUsers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        if (!term) return users

        return users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(term) ||
                user.lastName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.role.name.toLowerCase().includes(term)
        )
    }, [searchTerm, users])

    useEffect(() => {
        setUsers(initialUsers)
    }, [initialUsers])

    const updateUserInState = (updatedUser: User) => {
        setUsers((currentUsers) =>
            currentUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        )
        onUserUpdate?.(updatedUser)
    }

    return {
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
    }
}
