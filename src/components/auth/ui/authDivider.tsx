'use client'

import { Separator } from '@/components/ui/separator'

export default function AuthDivider() {
    return (
        <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>O</span>
            </div>
        </div>
    )
}
