"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Pill, Settings, ChevronRight } from "lucide-react"
import { useSidebar } from "@/contexts/sidebarContext"
import { navItems } from '@/components/layout/sidebar/navigation'
import LogoutButton from "./logoutButton"

const DesktopSidebar = () => {
    const pathname = usePathname()
    const { collapsed, setCollapsed } = useSidebar()

    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-40 hidden md:flex",
                collapsed ? "w-16" : "w-64",
            )}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Pill className="w-4 h-4 text-white" />
                    </div>
                    {!collapsed && <h1 className="ml-2 font-bold text-gray-900 dark:text-white">FarmaSystem</h1>}
                </div>
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Colapsar sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Botón para expandir cuando está colapsado */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm z-10"
                    aria-label="Expandir sidebar"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            )}

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
                                collapsed && "justify-center",
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "")} />
                            {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User Profile */}
            <div className="px-2 mb-4">
                <div
                    className={cn(
                        "flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                        collapsed && "justify-center",
                    )}
                >
                    {!collapsed ? (
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
                    ) : (
                        <Link
                            href="/dashboard/perfil"
                            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Ver perfil"
                        >
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                                JP
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <LogoutButton collapsed={collapsed} />
        </div>
    )
}

export default DesktopSidebar