/* eslint-disable */
'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Eye, Power } from 'lucide-react'
import type { User } from '@/types/user'

interface UserActionsMenuProps {
    user: User
    isAdmin: boolean
    onViewDetails: (user: User) => void
    onEditUser: (user: User) => void
    onToggleActive?: (user: User) => void
}

export { default } from '@/components/features/users/userActionsMenu'
