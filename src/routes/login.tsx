import { createFileRoute } from '@tanstack/react-router'
import { validateAuthSearch } from '@/pages/marketplace/components/auth/auth-search'
import { LoginRoutePage } from '@/pages/marketplace/components/auth/login-route-page'

export const Route = createFileRoute('/login')({
  validateSearch: validateAuthSearch,
  component: LoginRoutePage,
})
