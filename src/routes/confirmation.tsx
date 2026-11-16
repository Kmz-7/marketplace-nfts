import { createFileRoute } from '@tanstack/react-router'
import { requireAuthentication } from '@/lib/require-authentication'
import { OrderConfirmationPage } from '@/pages/marketplace/pages/order-confirmation-page'

export const Route = createFileRoute('/confirmation')({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === 'string' ? search.orderId : undefined,
  }),
  beforeLoad: ({ location }) => requireAuthentication(location.href),
  component: OrderConfirmationPage,
})
