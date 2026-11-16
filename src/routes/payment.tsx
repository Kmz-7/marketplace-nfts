import { createFileRoute } from '@tanstack/react-router'
import { PaymentPage } from '@/pages/marketplace/pages/payment-page'

export const Route = createFileRoute('/payment')({ component: PaymentPage })
