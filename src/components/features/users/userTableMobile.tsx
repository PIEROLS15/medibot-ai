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

export default function UsuariosTableMobile({
    filteredUsers,
    onViewDetails,
    onEditUser,
    onToggleActive
}: UsuariosTableMobileProps) {
    const { data: session } = useSession()
    const isAdmin = session?.user?.roleId === 1

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
                            <UserActionsMenu
                                user={user}
                                isAdmin={isAdmin}
                                onViewDetails={onViewDetails}
                                onEditUser={onEditUser}
                                onToggleActive={onToggleActive}
                            />
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
