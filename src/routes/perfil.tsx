import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/perfil')({ component: AccountPage })
