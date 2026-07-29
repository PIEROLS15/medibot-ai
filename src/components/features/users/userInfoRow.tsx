'use client'

import type { ReactNode } from 'react'

interface UserInfoRowProps {
    icon: ReactNode
    title: string
    value: ReactNode
}

export default function UserInfoRow({ icon, title, value }: UserInfoRowProps) {
    return (
        <div className='flex items-center space-x-3'>
            {icon}
            <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>{title}</p>
                <div className='text-sm text-gray-500 dark:text-gray-400'>{value}</div>
            </div>
        </div>
    )
}
