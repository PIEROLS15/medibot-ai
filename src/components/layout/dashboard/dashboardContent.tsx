"use client"

import { useSidebar } from "@/contexts/sidebarContext"
import Sidebar from "@/components/layout/sidebar/page"
import ThemeToggle from "@/components/ui/themeToggle"
import MobileMenuButton from "@/components/mobile-menu-button"
import type { ReactNode } from "react"

export default function DashboardContent({ children }: { children: ReactNode }) {
    const { collapsed, isMobile } = useSidebar()

    return (
        <div className="min-h-screen bg-gradient-to-br from-tertiary/30 to-white dark:from-gray-900 dark:to-gray-800">
            <Sidebar />
            <MobileMenuButton />
            <div
                className={`transition-all duration-300 p-4 md:p-8 relative min-h-screen ${isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"
                    }`}
            >
                <div className={`absolute top-4 z-50 ${isMobile ? "right-4" : "right-4"}`}>
                    <ThemeToggle />
                </div>
                <div className={`max-w-8xl mx-auto ${isMobile ? "pt-16" : ""}`}>{children}</div>
            </div>
        </div>
    )
}   
