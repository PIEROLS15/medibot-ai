/* eslint-disable */
"use client"

import { useEffect, useMemo, useState } from "react"
import { User } from "@/types/user"
import EditarUsuarioModal from "@/components/layout/users/editUserModal"
import DetallesUsuarioModal from "@/components/layout/users/userDetailsModal"
import UsuariosTableDesktop from "@/components/layout/users/userTableDesktop"
import UsuariosTableMobile from "@/components/layout/users/userTableMobile"
import UserStatusDialog from "./userStatusDialog"

interface UsersTableProps {
    users: User[]
    searchTerm: string
    onUserUpdate?: (updatedUser: User) => void
}

export { default } from '@/components/features/users/usersTable'
