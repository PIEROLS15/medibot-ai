import RegistroForm from '@/components/auth/register/registerForm'

export default function RegistroPage() {

    const nameSystem = process.env.NEXT_PUBLIC_NAME || 'Nombre del sistema'
    const descriptionSystem = process.env.NEXT_PUBLIC_DESCRIPTION || 'Descripción del sistema'

    return (
        <div className='min-h-screen bg-gradient-to-br from-tertiary to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-primary mb-2 dark:text-primary'>{nameSystem}</h1>
                    <p className='text-gray-600 dark:text-gray-300'>{descriptionSystem}</p>
                </div>
                <RegistroForm />
            </div>
        </div>
    )
}
