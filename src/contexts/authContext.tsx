"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Session } from "next-auth"

interface AuthContextType {
    session: Session | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
    children,
    session
}: {
    children: ReactNode
    session: Session | null
}) {
    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}