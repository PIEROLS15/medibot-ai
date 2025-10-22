'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Loader from '@/components/loader';

interface LogoutButtonProps {
    collapsed?: boolean;
}

const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut({ redirect: false });
            router.push('/');
            setTimeout(() => setIsLoggingOut(false), 1000);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoggingOut(false);
        }
    };

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
