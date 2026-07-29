'use client'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'
import ForgotPasswordModal from '@/components/auth/forgotPasswordModal'
import GoogleButton from '@/components/ui/googleButton'
import AuthDivider from './authDivider'
import TextField from './textField'
import PasswordField from './passwordField'
import { useLoginForm } from '@/hooks/useLoginForm'

const LoginForm = () => {
    const {
        showForgotPassword,
        setShowForgotPassword,
        formData,
        setFormData,
        showPassword,
        setShowPassword,
        handleGoogleSignIn,
        isLoadingGoogle,
        isLoading,
        errors,
        handleSubmit,
    } = useLoginForm()

    return (
        <>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <TextField
                    id='email'
                    name='email'
                    type='email'
                    label='Correo Electrónico'
                    placeholder='Ingresa tu correo electrónico'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    icon={<Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500' />}
                />

                <PasswordField
                    id='password'
                    label='Contraseña'
                    value={formData.password}
                    onChange={(value) => setFormData({ ...formData, password: value })}
                    showPassword={showPassword}
                    onToggleVisibility={() => setShowPassword(!showPassword)}
                    error={errors.password}
                    placeholder='Ingresa tu contraseña'
                />

                <div className='flex justify-end'>
                    <button
                        type='button'
                        onClick={() => setShowForgotPassword(true)}
                        className='text-sm text-primary hover:text-secondary transition-colors dark:text-primary dark:hover:text-secondary'
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </div>

                <Button
                    type='submit'
                    className='w-full bg-primary hover:bg-secondary text-white font-medium py-2.5 dark:bg-primary dark:hover:bg-secondary'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Iniciando sesión...
                        </>
                    ) : (
                        'Iniciar Sesión'
                    )}
                </Button>
            </form>

                <div className='mt-6'>
                <AuthDivider />

                <GoogleButton
                    isLoading={isLoadingGoogle}
                    onClick={handleGoogleSignIn}
                    label='Iniciar sesión con Google'
                />
            </div>

            <ForgotPasswordModal open={showForgotPassword} onOpenChange={setShowForgotPassword} />
        </>
    )
}

export default LoginForm
