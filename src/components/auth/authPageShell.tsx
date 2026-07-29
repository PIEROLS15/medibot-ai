import type { ReactNode } from 'react'

interface AuthPageShellProps {
    title: string
    description: string
    children: ReactNode
    className?: string
}

export default function AuthPageShell({ title, description, children, className = 'max-w-md' }: AuthPageShellProps) {
    return (
        <div className='min-h-screen bg-gradient-to-br from-tertiary to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative'>
            <div className={`w-full ${className}`}>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-primary mb-2 dark:text-primary'>{title}</h1>
                    <p className='text-gray-600 dark:text-gray-300'>{description}</p>
                </div>
                {children}
            </div>
        </div>
    )
}
