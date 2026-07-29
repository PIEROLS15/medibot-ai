/* eslint-disable */
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Shield, Calendar, Activity } from "lucide-react"
import { User } from "@/types/user"
import { getRoleUser, getStatusUser, getNameRoleUser, getInitials } from '@/utils/user'
import { formatDate } from '@/utils/base'
import UserInfoRow from './userInfoRow'

interface DetailsUserModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
}

export { default } from '@/components/features/users/userDetailsModal'
