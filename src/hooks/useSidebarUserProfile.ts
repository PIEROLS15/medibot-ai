"use client"

import { useSession } from 'next-auth/react'
import { getInitials, getNameRoleUser } from '@/utils/user'

export function useSidebarUserProfile() {
    const { data: session } = useSession()
    const firstName = session?.user?.firstName ?? ''
    const lastName = session?.user?.lastName ?? ''

    return {
        displayName: `${firstName} ${lastName}`.trim(),
        initials: getInitials(firstName, lastName),
        profileImage: session?.user?.image ?? null,
        roleLabel: session?.user?.role ? getNameRoleUser(session.user.role) : '',
    }
}
