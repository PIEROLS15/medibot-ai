import type { ReactNode } from "react"
import { SidebarProvider } from "@/contexts/sidebarContext"
import DashboardContent from "@/components/layout/dashboard/dashboardContent"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    )
}
