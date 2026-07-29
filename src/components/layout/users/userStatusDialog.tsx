/* eslint-disable */
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

export { default } from '@/components/features/users/userStatusDialog'
