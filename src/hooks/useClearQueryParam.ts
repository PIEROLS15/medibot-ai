"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useClearQueryParam(paramName: string) {
    const params = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (params.get(paramName)) {
            router.replace(window.location.pathname)
        }
    }, [params, paramName, router])
}
