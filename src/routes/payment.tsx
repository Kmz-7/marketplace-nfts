import { createFileRoute } from '@tanstack/react-router'
import { requireAuthentication } from '@/lib/require-authentication'
import { PaymentPage } from '@/pages/marketplace/pages/payment-page'

export const Route = createFileRoute('/payment')({
  validateSearch: (search: Record<string, unknown>) => ({
    coupon: typeof search.coupon === 'string' ? search.coupon : undefined,
  }),
  beforeLoad: ({ location }) => requireAuthentication(location.href),
  component: PaymentPage,
})
