"use client"

import { useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from '@/types/user'
import { useUser } from "@/hooks/useUser"

interface UserStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
    onStatusUpdated?: (user: User) => void
}

const UserStatusDialog = ({
    open,
    onOpenChange,
    user,
    onStatusUpdated
}: UserStatusDialogProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const isActivating = user?.isActive === false
    const { updateStatusUser } = useUser()

    const handleSubmit = async () => {
        if (!user || user.id === undefined || user.isActive === undefined) return

        setIsLoading(true)
        try {
            await updateStatusUser(user.id, user, !user.isActive)
            const usuarioActualizado = { ...user, isActive: !user.isActive }
            onStatusUpdated?.(usuarioActualizado)

            onOpenChange(false)
        } catch (error) {
            console.error('Error in handleSubmit:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-[95vw] max-w-lg mx-auto dark:bg-gray-800 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${isActivating ? "text-primary" : "text-destructive"}`} />
                        {isActivating ? "Activar usuario" : "Desactivar usuario"}
                    </DialogTitle>
                    <DialogDescription>
                        {isActivating
                            ? `¿Estás seguro de que deseas activar al usuario ${user.firstName} ${user.lastName}? El usuario podrá acceder nuevamente al sistema.`
                            : `¿Estás seguro de que deseas desactivar al usuario ${user?.firstName} ${user?.lastName}? El usuario no podrá acceder al sistema hasta que sea activado nuevamente.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-4 sm:gap-2 flex-col sm:flex-row">
                    <DialogClose disabled={isLoading}>Cancelar</DialogClose>
                    <Button
                        variant={isActivating ? "default" : "destructive"}
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isActivating ? "Activando..." : "Desactivando..."}
                            </>
                        ) : isActivating ? (
                            "Activar"
                        ) : (
                            "Desactivar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UserStatusDialog
