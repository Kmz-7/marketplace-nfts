import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/pages/marketplace/pages/auth-page'

export const Route = createFileRoute('/register')({ component: () => <AuthPage register /> })
