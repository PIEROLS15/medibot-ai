'use client'

import { useSession } from "next-auth/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { getRoleUser, getStatusUser, getNameRoleUser } from '@/utils/user'
import { formatDate } from '@/utils/base'

interface UsuariosTableDesktopProps {
    filteredUsers: User[]
    onViewDetails: (user: User) => void
    onEditUser: (user: User) => void
    onToggleActive?: (user: User) => void
}

export default function UsuariosTableDesktop({
    filteredUsers,
    onViewDetails,
    onEditUser,
    onToggleActive,

}: UsuariosTableDesktopProps) {
    const { data: session } = useSession()
    const isAdmin = session?.user?.roleId === 1

    return (
        <div className='hidden md:block rounded-md border dark:border-gray-700 overflow-hidden'>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-50 dark:bg-gray-800'>
                            <TableHead className='font-medium text-center'>Nombre</TableHead>
                            <TableHead className='font-medium text-center'>Correo</TableHead>
                            <TableHead className='font-medium text-center'>Rol</TableHead>
                            <TableHead className='font-medium text-center'>Estado</TableHead>
                            <TableHead className='font-medium text-center'>Fecha Registro</TableHead>
                            <TableHead className='font-medium text-center'>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className='dark:border-gray-700'>
                                    <TableCell className='font-medium dark:text-white text-center'>
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell className='dark:text-gray-300 text-center'>{user.email}</TableCell>
                                    <TableCell className='text-center'>
                                        <Badge className={getRoleUser(user.role.name)}>
                                            {getNameRoleUser(user.role.name)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge
                                            variant={getStatusUser(user.isActive)}
                                            className='justify-center w-20'
                                        >
                                            {user.isActive === true ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='dark:text-gray-300 text-center'>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell className='text-center'>
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
                                                            onClick={() => onToggleActive && onToggleActive(user)}
                                                        >
                                                            <Power className='mr-2 h-4 w-4' />
                                                            {user.isActive ? 'Desactivar' : 'Activar'}
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className='h-24 text-center dark:text-gray-400'>
                                    No se encontraron usuarios.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
