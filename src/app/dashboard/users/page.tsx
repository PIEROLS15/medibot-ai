"use client"

import { useState } from "react"
import Header from '@/components/layout/header'
import { UserPlus } from 'lucide-react'
import RegistroUsuarioModal from '@/components/auth/register/registerUserModal'

const Users = () => {
    const [showRegistroModal, setShowRegistroModal] = useState(false)

    return (
        <>
            <div className="space-y-6 pt-10">
                <Header
                    title="Gestión de Usuarios"
                    description="Administre los usuarios del sistema"
                    iconoButton={UserPlus}
                    textButton="Registrar Usuario"
                    onOpenModal={() => setShowRegistroModal(true)}
                />

                <RegistroUsuarioModal open={showRegistroModal} onOpenChange={setShowRegistroModal} />

            </div>
        </>
    )
}

export default Users