'use client'

import { Badge } from '@/components/ui/badge'
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
import { User } from '@/types/user'
import { formatDate } from '@/utils/base'
import { getRoleUser, getStatusUser, getNameRoleUser } from '@/utils/user'

interface UsuariosTableMobileProps {
    filteredUsers: User[]
    onViewDetails: (user: User) => void
    onEditUser: (user: User) => void
    onToggleActive?: (user: User) => void
}

export default function UsuariosTableMobile({
    filteredUsers,
    onViewDetails,
    onEditUser,
    onToggleActive
}: UsuariosTableMobileProps) {
    return (
        <div className='md:hidden space-y-4'>
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3'
                    >
                        <div className='flex items-start justify-between'>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-medium text-gray-900 dark:text-white truncate'>
                                    {user.firstName} {user.lastName}
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-gray-400 truncate'>{user.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='h-8 w-8 p-0 flex-shrink-0'>
                                        <span className='sr-only'>Abrir menú</span>
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
                                    <DropdownMenuItem
                                        className='dark:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-white cursor-pointer'
                                        onClick={() => onEditUser(user)}
                                    >
                                        <Edit className='mr-2 h-4 w-4' />
                                        Editar usuario
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className='dark:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-white cursor-pointer'
                                        onClick={() => onToggleActive && onToggleActive(user)}
                                    >
                                        <Power className='mr-2 h-4 w-4' />
                                        {user.isActive ? 'Desactivar' : 'Activar'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-2'>
                                <Badge className={getRoleUser(user.role.name)}>
                                    {getNameRoleUser(user.role.name)}
                                </Badge>
                                <Badge variant={getStatusUser(user.isActive)}>
                                    {user.isActive === true ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                        </div>

                        <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                Registrado: {formatDate(user.createdAt)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className='text-center py-8 text-gray-500 dark:text-gray-400'>No se encontraron usuarios.</div>
            )}
        </div>
    )
}