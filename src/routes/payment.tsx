import { createFileRoute } from '@tanstack/react-router'
import { requireAuthentication } from '@/lib/require-authentication'
import { PaymentPage } from '@/pages/marketplace/pages/payment-page'

export const Route = createFileRoute('/payment')({
  beforeLoad: ({ location }) => requireAuthentication(location.href),
  component: PaymentPage,
})
