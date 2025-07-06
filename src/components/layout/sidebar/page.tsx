import { useSidebar } from "@/contexts/sidebarContext"
import MobileSidebar from "@/components/layout/sidebar/mobileSidebar"
import DesktopSidebar from "@/components/layout/sidebar/desktopSidebar"

const Sidebar = () => {
    const { isMobile } = useSidebar()

    return (
        <div>
            {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
        </div>
    )
}

export default Sidebar