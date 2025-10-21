import { Pill, Users, UserCheck, LayoutDashboard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
    name: string
    href: string
    icon: LucideIcon
    roles?: string[]
}

export const navItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['Administrator', 'Pharmacist'],
    },
    {
        name: 'Recomendación',
        href: '/dashboard/recommendation',
        icon: Pill,
        roles: ['Administrator', 'Pharmacist', 'Visitor'],
    },
    {
        name: 'Usuarios',
        href: '/dashboard/users',
        icon: Users,
        roles: ['Administrator'],
    },
    {
        name: 'Clientes',
        href: '/dashboard/patients',
        icon: UserCheck,
        roles: ['Administrator', 'Pharmacist'],
    }
]
