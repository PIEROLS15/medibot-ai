"use client"

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

export function useUsersPage() {
    const [showRegistroModal, setShowRegistroModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const { user } = useUser()

    return {
        showRegistroModal,
        setShowRegistroModal,
        searchTerm,
        setSearchTerm,
        user,
    }
}
