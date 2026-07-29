import RegistroForm from '@/components/auth/register/registerForm'
import AuthPageShell from '@/components/auth/authPageShell'

export default function RegistroPage() {
    const nameSystem = process.env.NEXT_PUBLIC_NAME || 'Nombre del sistema'
    const descriptionSystem = process.env.NEXT_PUBLIC_DESCRIPTION || 'Descripción del sistema'

    return (
        <AuthPageShell title={nameSystem} description={descriptionSystem}>
            <RegistroForm />
        </AuthPageShell>
    )
}
