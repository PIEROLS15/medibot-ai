"use client"

import { useSession } from 'next-auth/react'

interface UseHeaderActionsParams {
    button?: React.ReactNode | null
    textButton?: string
    onOpenModal?: () => void
}

export function useHeaderActions({ button, textButton, onOpenModal }: UseHeaderActionsParams) {
    const { data: session } = useSession()
    const isAdmin = session?.user?.roleId === 1
    const showActionButton = button !== null && !!textButton && !!onOpenModal

    return { isAdmin, showActionButton }
}
