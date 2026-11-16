import { AuthForm } from '@/pages/marketplace/components/auth/auth-form'
import { DesktopAuthDialog } from '@/pages/marketplace/components/auth/desktop-auth-dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { HomePage } from '@/pages/home/home.page'

export function AuthPage({
  register = false,
  returnTo,
}: {
  register?: boolean
  returnTo?: string
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <main className="min-h-dvh w-full bg-background">
        <AuthForm register={register} returnTo={returnTo} />
      </main>
    )
  }

  return (
    <>
      <HomePage />
      <DesktopAuthDialog register={register} returnTo={returnTo} />
    </>
  )
}
