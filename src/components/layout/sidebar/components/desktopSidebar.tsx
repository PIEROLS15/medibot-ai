'use client'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useSidebar } from '@/contexts/sidebarContext'
import LogoutButton from './logoutButton'
import UserProfile from '../components/userProfile'
import NavigationItems from '../components/navigationItems'
import Image from 'next/image'

const DesktopSidebar = () => {
    const { collapsed, setCollapsed } = useSidebar()

    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || '/default_logo.png'
    const nameSystem = process.env.NEXT_PUBLIC_NAME || 'Nombre del sistema'

    return (
        <div
            className={cn(
                'fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col transition-all duration-300 z-40 hidden md:flex',
                collapsed ? 'w-16' : 'w-64',
            )}
        >
            {/* Header */}
            <div className='p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800'>
                <div className={cn('flex items-center', collapsed && 'justify-center w-full')}>
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
                    {!collapsed && (
                        <h1 className='ml-2 font-bold text-gray-900 dark:text-white'>{nameSystem}</h1>
                    )}
                </div>
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className='w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        aria-label='Colapsar sidebar'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <path d='m15 18-6-6 6-6' />
                        </svg>
                    </button>
                )}
            </div>

            {/* Botón para expandir cuando está colapsado */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className='absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm z-10'
                    aria-label='Expandir sidebar'
                >
                    <ChevronRight className='h-4 w-4' />
                </button>
            )}

            <NavigationItems collapsed={collapsed} />

            <UserProfile collapsed={collapsed} />

            <LogoutButton collapsed={collapsed} />
        </div>
    )
}

export default DesktopSidebar
