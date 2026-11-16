import { createFileRoute } from '@tanstack/react-router'
import { requireAuthentication } from '@/lib/require-authentication'
import { AccountPage } from '@/pages/marketplace/pages/account-page'

export const Route = createFileRoute('/wallets')({
  beforeLoad: ({ location }) => requireAuthentication(location.href),
  component: () => <AccountPage wallets />,
})
