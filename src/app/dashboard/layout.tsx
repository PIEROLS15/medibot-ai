import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/contexts/sidebarContext"
import DashboardContent from "@/components/layout/dashboard/dashboardContent"
import { AuthProvider } from "@/contexts/authContext"
import { auth } from "@/auth.config"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth()

    if (!session) {
        redirect("/")
    }

    return (
        <AuthProvider session={session}>
            <SidebarProvider>
                <DashboardContent>{children}</DashboardContent>
            </SidebarProvider>
        </AuthProvider>
    )
}
