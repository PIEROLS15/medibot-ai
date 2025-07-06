import { Pill, Users, UserCheck, LayoutDashboard } from "lucide-react"

export const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Recomendación",
        href: "/dashboard/recommendation",
        icon: Pill,
    },
    {
        name: "Usuarios",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        name: "Clientes",
        href: "/dashboard/patients",
        icon: UserCheck,
    }
]