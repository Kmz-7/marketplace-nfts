import { AuthForm } from '@/pages/marketplace/components/auth/auth-form'
import { DesktopAuthDialog } from '@/pages/marketplace/components/auth/desktop-auth-dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { HomePage } from '@/pages/home/home.page'

export function AuthPage({ register = false }: { register?: boolean }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <main className="mx-auto w-full max-w-md">
        <AuthForm register={register} />
      </main>
    )
  }

  return (
    <>
      <HomePage />
      <DesktopAuthDialog register={register} />
    </>
  )
}
