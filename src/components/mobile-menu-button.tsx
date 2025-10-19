"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "@/contexts/sidebarContext"

const MobileMenuButton = () => {
    const { mobileOpen, setMobileOpen, isMobile } = useSidebar()

    if (!isMobile || mobileOpen) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700"
            aria-label="Abrir menú"
        >
            <Menu className="h-5 w-5" />
        </Button>
    )
}

export default MobileMenuButton
