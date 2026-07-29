/* eslint-disable */
'use client'

import { useSession } from "next-auth/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/user'
import { getRoleUser, getStatusUser, getNameRoleUser } from '@/utils/user'
import { formatDate } from '@/utils/base'
import UserActionsMenu from './userActionsMenu'

interface UsuariosTableDesktopProps {
    filteredUsers: User[]
    onViewDetails: (user: User) => void
    onEditUser: (user: User) => void
    onToggleActive?: (user: User) => void
}

export { default } from '@/components/features/users/userTableDesktop'
