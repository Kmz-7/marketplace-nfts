import { createFileRoute } from '@tanstack/react-router'
import { validateAuthSearch } from '@/pages/marketplace/components/auth/auth-search'
import { RegisterRoutePage } from '@/pages/marketplace/components/auth/register-route-page'

export const Route = createFileRoute('/register')({
  validateSearch: validateAuthSearch,
  component: RegisterRoutePage,
})
