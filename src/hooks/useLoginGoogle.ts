import { useState } from 'react'
import { signIn } from 'next-auth/react'

export const useLoginGoogle = () => {
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoadingGoogle(true)

        try {
            await signIn('google', { callbackUrl: '/dashboard' })
        } finally {
            setIsLoadingGoogle(false)
        }
    }

    return {
        isLoadingGoogle,
        handleGoogleSignIn,
    }
}
