'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useSidebar } from '@/contexts/sidebarContext'
import { useEffect } from 'react'
import LogoutButton from './logoutButton'
import UserProfile from './userProfile'
import NavigationItems from './navigationItems'
import Image from 'next/image'

const MobileSidebar = () => {
    const pathname = usePathname()
    const { mobileOpen, setMobileOpen, isMobile } = useSidebar()
    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || '/default_logo.png'
    const nameSystem = process.env.NEXT_PUBLIC_NAME || 'Nombre del sistema'

    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false)
        }
    }, [pathname, isMobile, setMobileOpen])

    return (
        <>
            {/* Overlay */}
            {mobileOpen && (
                <div
                    className='fixed inset-0 bg-black/50 z-40 md:hidden'
                    onClick={() => setMobileOpen(false)}
                    aria-hidden='true'
                />
            )}

            <div
                className={cn(
                    'fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 z-50 md:hidden',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className='p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center'>
                        <div className='flex items-center justify-center'>
                            <Image
                                src={logoPath}
                                alt='Medibot AI Logo'
                                width={64}
                                height={64}
                                className='rounded-full'
                                priority
                            />
                        </div>
                        <h1 className='ml-2 font-bold text-gray-900 dark:text-white'>{nameSystem}</h1>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className='w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        aria-label='Cerrar menú'
                    >
                        <X className='h-4 w-4' />
                    </button>
                </div>

                <NavigationItems />

                <UserProfile />

                <LogoutButton />

            </div>
        </>
    )
}

export default MobileSidebar
