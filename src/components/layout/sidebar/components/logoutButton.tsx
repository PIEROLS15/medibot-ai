'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import Loader from '@/components/loader';
import { useLogout } from '@/hooks/useLogout';

interface LogoutButtonProps {
    collapsed?: boolean;
}

const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
    const { isLoggingOut, handleLogout } = useLogout();

    return (
        <>
            <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
                <Button
                    onClick={handleLogout}
                    variant='ghost'
                    disabled={isLoggingOut}
                    className={cn(
                        'w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                        collapsed && 'justify-center',
                    )}
                >
                    <LogOut className='h-5 w-5' />
                    {!collapsed && (
                        <span className='ml-2'>
                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </span>
                    )}
                </Button>
            </div>

            {isLoggingOut && typeof document !== 'undefined' &&
                createPortal(<Loader />, document.body)
            }
        </>
    );
};

export default LogoutButton;
