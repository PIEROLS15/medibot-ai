'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
    title: string
    description: string
    iconoButton?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    textButton?: string
    button?: React.ReactNode | null
    onOpenModal?: () => void
}

const Header = ({
    title,
    description,
    iconoButton: Icon,
    textButton,
    button,
    onOpenModal,
}: HeaderProps) => {
    const { data: session } = useSession()
    const isAdmin = session?.user?.roleId === 1

    return (
        <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h1>
                <p className='text-gray-600 dark:text-gray-300'>{description}</p>
            </div>
            {isAdmin && (
                <>
                    {button !== null && (
                        <Button
                            className='bg-primary hover:bg-secondary text-white self-start sm:self-auto'
                            onClick={onOpenModal}
                        >
                            {Icon && <Icon className='mr-2 h-4 w-4' />}
                            {textButton}
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

export default Header
