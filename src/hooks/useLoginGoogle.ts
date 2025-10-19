import { useState } from 'react'
import { signIn } from 'next-auth/react'

export const useLoginGoogle = () => {
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

    const handleGoogleSignIn = () => {
        setIsLoadingGoogle(true)
        signIn('google', { callbackUrl: '/dashboard' })
    }

    return {
        isLoadingGoogle,
        handleGoogleSignIn,
    }
}
