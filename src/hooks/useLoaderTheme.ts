"use client"

import { useEffect, useState } from 'react'

export function useLoaderTheme() {
    const [isDark, setIsDark] = useState<boolean | null>(null)

    useEffect(() => {
        const localTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        setIsDark(localTheme === 'dark' || (!localTheme && prefersDark))

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'))
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => observer.disconnect()
    }, [])

    return isDark
}
