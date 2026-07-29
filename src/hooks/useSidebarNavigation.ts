"use client"

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { navItems } from '@/components/layout/sidebar/components/navigation'

export function useSidebarNavigation() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = session?.user?.role ?? ''

    const items = navItems
        .filter((item) => !item.roles || item.roles.includes(userRole))
        .map((item) => ({
            ...item,
            isActive: pathname === item.href,
        }))

    return { items }
}
