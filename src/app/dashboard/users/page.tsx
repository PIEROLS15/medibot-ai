import Header from '@/components/layout/header'
import { UserPlus } from 'lucide-react'

const Users = () => {
    return (
        <>
            <div className="space-y-6 pt-10">
                <Header
                    title="Gestión de Usuarios"
                    description="Administre los usuarios del sistema"
                    iconoButton={UserPlus}
                    textButton="Registrar Usuario"
                />

            </div>
        </>
    )
}

export default Users