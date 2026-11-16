import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/pages/marketplace/pages/account-page'

export const Route = createFileRoute('/profile')({ component: AccountPage })
