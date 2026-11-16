import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationPage } from '@/pages/marketplace/pages/order-confirmation-page'

export const Route = createFileRoute('/confirmation')({
  component: OrderConfirmationPage,
})
