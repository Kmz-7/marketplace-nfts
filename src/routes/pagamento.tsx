import { createFileRoute } from '@tanstack/react-router'
import { PaymentPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/pagamento')({ component: PaymentPage })
