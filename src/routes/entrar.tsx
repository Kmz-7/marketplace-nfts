import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/entrar')({ component: AuthPage })
