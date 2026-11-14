import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/carrinho')({ component: CartPage })
