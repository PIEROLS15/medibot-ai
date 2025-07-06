import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
    collapsed?: boolean;
}

const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    collapsed && "justify-center",
                )}
            >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
            </Button>
        </div>
    )
}

export default LogoutButton