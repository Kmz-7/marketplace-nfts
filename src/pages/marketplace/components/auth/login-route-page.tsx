import { useSearch } from '@tanstack/react-router'
import { AuthPage } from '@/pages/marketplace/pages/auth-page'

export function LoginRoutePage() {
  const { returnTo } = useSearch({ from: '/login' })
  return <AuthPage returnTo={returnTo} />
}
