import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '@/pages/marketplace/pages/cart-page'

export const Route = createFileRoute('/cart')({ component: CartPage })
