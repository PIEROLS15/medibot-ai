import Link from "next/link"
// import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from 'next-auth/react'
import Image from "next/image"

interface UserProfileProps {
    collapsed?: boolean
}

const UserProfile = ({ collapsed = false }: UserProfileProps) => {
    const { data: session } = useSession()

    const initials = session?.user
        ? (session.user.firstName.charAt(0).toUpperCase() + session.user.lastName.charAt(0).toUpperCase())
        : ''

    const profileImage = session?.user?.image

    return (
        <div className="px-2 mb-4">
            <div
                className={cn(
                    "flex items-center p-3 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                    collapsed && "justify-center"
                )}
            >
                {!collapsed ? (
                    <div className="flex items-center w-full">
                        {/* 👇 Renderiza imagen o iniciales */}
                        {profileImage ? (
                            <Image
                                src={profileImage}
                                alt="Foto de perfil"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {initials || '??'}
                            </div>
                        )}

                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {session?.user?.firstName} {session?.user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate" data-testid="user-role">
                                {session?.user?.role === 'Administrator'
                                    ? 'Administrador'
                                    : session?.user?.role === 'Pharmacist'
                                        ? 'Farmacéutico'
                                        : ''}
                            </p>
                        </div>

                        {/* <Link
                            href="/dashboard/perfil"
                            className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Ver perfil"
                        >
                            <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </Link> */}
                    </div>
                ) : (
                    <Link
                        href="/dashboard/perfil"
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Ver perfil"
                    >
                        {profileImage ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-500/40 dark:border-gray-700 flex items-center justify-center">
                                <Image
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {initials || '??'}
                            </div>
                        )}
                    </Link>

                )}
            </div>
        </div>
    )
}

export default UserProfile
