import { useSearch } from '@tanstack/react-router'
import { AuthPage } from '@/pages/marketplace/pages/auth-page'

export function RegisterRoutePage() {
  const { returnTo } = useSearch({ from: '/register' })
  return <AuthPage register returnTo={returnTo} />
}
