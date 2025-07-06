"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Pill, Settings, X } from "lucide-react"
import { useSidebar } from "@/contexts/sidebarContext"
import { useEffect } from "react"
import { navItems } from '@/components/layout/sidebar/navigation'
import LogoutButton from "./logoutButton"

const MobileSidebar = () => {
    const pathname = usePathname()
    const { mobileOpen, setMobileOpen, isMobile } = useSidebar()

    // Cerrar sidebar móvil cuando cambia la ruta
    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false)
        }
    }, [pathname, isMobile, setMobileOpen])

    return (
        <>
            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar móvil */}
            <div
                className={cn(
                    "fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 z-50 md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Pill className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="ml-2 font-bold text-gray-900 dark:text-white">FarmaSystem</h1>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Cerrar menú"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-3 rounded-md transition-colors",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "")} />
                                <span className="ml-3 text-sm font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User Profile */}
                <div className="px-2 mb-4">
                    <div className="flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center w-full">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                JD
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Juan Pérez</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrador</p>
                            </div>
                            <Link
                                href="/dashboard/perfil"
                                className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Ver perfil"
                            >
                                <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </Link>
                        </div>
                    </div>
                </div>

                <LogoutButton />

            </div>
        </>
    )
}

export default MobileSidebar