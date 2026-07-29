import LoginPage from '@/components/auth/loginPage'
import AuthPageShell from '@/components/auth/authPageShell'

const Home = () => {
  const nameSystem = process.env.NEXT_PUBLIC_NAME || 'Nombre del sistema'
  const descriptionSystem = process.env.NEXT_PUBLIC_DESCRIPTION || 'Descripción del sistema'

  return (
    <AuthPageShell title={nameSystem} description={descriptionSystem}>
      <LoginPage />
    </AuthPageShell>
  )
}

export default Home;
