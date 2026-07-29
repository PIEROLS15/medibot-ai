"use client"

import { useEffect } from 'react'
import { useSidebar } from '@/contexts/sidebarContext'

export function useSidebarAutoClose() {
    const { pathname, isMobile, setMobileOpen } = useSidebar()

    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false)
        }
    }, [pathname, isMobile, setMobileOpen])
}
