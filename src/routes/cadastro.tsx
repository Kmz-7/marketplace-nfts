import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/cadastro')({ component: () => <AuthPage register /> })
