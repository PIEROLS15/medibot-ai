import Link from "next/link"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProfileProps {
    collapsed?: boolean
}

const UserProfile = ({ collapsed = false }: UserProfileProps) => {
    return (
        <>
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
        </>
    );
}

export default UserProfile;