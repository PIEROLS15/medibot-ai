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

export default function UserActionsMenu({
    user,
    isAdmin,
    onViewDetails,
    onEditUser,
    onToggleActive,
}: UserActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='dark:bg-gray-900 dark:border-gray-800'>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator className='dark:border-gray-700' />
                <DropdownMenuItem
                    className='dark:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-white cursor-pointer'
                    onClick={() => onViewDetails(user)}
                >
                    <Eye className='mr-2 h-4 w-4' />
                    Ver detalles
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            className='dark:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-white cursor-pointer'
                            onClick={() => onEditUser(user)}
                        >
                            <Edit className='mr-2 h-4 w-4' />
                            Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className='dark:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-white cursor-pointer'
                            onClick={() => onToggleActive?.(user)}
                        >
                            <Power className='mr-2 h-4 w-4' />
                            {user.isActive ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
