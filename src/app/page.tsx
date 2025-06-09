import LoginPage from "@/components/auth/loginPage"
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

const Home = async () => {

  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-tertiary to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 dark:text-primary">Sistema de Recomendación</h1>
          <p className="text-gray-600 dark:text-gray-300">Portal para Farmacéuticos</p>
        </div>
        <LoginPage />
      </div>
    </div>
  )
}

export default Home;