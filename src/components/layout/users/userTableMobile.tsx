/* eslint-disable */
'use client'

import { useSession } from "next-auth/react"
import { Badge } from '@/components/ui/badge'
import UserActionsMenu from './userActionsMenu'
import { User } from '@/types/user'
import { formatDate } from '@/utils/base'
import { getRoleUser, getStatusUser, getNameRoleUser } from '@/utils/user'

interface UsuariosTableMobileProps {
    filteredUsers: User[]
    onViewDetails: (user: User) => void
    onEditUser: (user: User) => void
    onToggleActive?: (user: User) => void
}

export { default } from '@/components/features/users/userTableMobile'
