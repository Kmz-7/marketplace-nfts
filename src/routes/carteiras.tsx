import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/carteiras')({ component: () => <AccountPage wallets /> })
