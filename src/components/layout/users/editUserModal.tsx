/* eslint-disable */
import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"
import { useUser } from "@/hooks/useUser"
import { useRoles } from "@/hooks/useRoles"
import UserEditFields from './userEditFields'

interface EditarUsuarioModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
    onUserUpdated: (user: User) => void
}

export { default } from '@/components/features/users/editUserModal'
