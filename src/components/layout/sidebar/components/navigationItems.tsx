import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from '@/components/layout/sidebar/components/navigation'

interface NavigationItemsProps {
    collapsed?: boolean
}

const NavigationItems = ({ collapsed = false }: NavigationItemsProps) => {
    const pathname = usePathname()

    return (
        <>
            <div className="flex-1 py-6 overflow-y-auto">
                <nav className="px-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-3 rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                collapsed && "justify-center",
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "")} />
                            {!collapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}

export default NavigationItems