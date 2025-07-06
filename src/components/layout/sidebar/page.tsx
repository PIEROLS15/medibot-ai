import { useSidebar } from "@/contexts/sidebarContext"
import MobileSidebar from "@/components/layout/sidebar/components/mobileSidebar"
import DesktopSidebar from "@/components/layout/sidebar/components/desktopSidebar"

const Sidebar = () => {
    const { isMobile } = useSidebar()

    return (
        <div>
            {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
        </div>
    )
}

export default Sidebar