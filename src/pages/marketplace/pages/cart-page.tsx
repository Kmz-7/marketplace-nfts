import { useState } from 'react'
import { items } from '@/pages/marketplace/marketplace-data'
import { CartItemsSection } from '@/pages/marketplace/components/cart/cart-items-section'
import type { CartItem } from '@/pages/marketplace/components/cart/cart-items-section'
import { CartSummary } from '@/pages/marketplace/components/cart/cart-summary'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { RelatedProducts } from '@/pages/marketplace/components/related-products'

export function CartPage() {
  const [quantities, setQuantities] = useState([2, 6, 9])
  const cartItems: CartItem[] = items.slice(0, 3).map((item, index) => ({
    ...item,
    tokenId: ['#0042', '#0009', '#0552'][index],
    quantity: quantities[index],
  }))
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const networkFee = 0.016

  const changeQuantity = (index: number, amount: number) => {
    setQuantities((current) =>
      current.map((quantity, itemIndex) =>
        itemIndex === index ? Math.max(1, quantity + amount) : quantity,
      ),
    )
  }

  return (
    <main className="py-8 md:py-10">
      <MarketplaceBreadcrumb currentPage="Carrinho" className="text-sm" />
      <div className="grid items-start gap-20 lg:grid-cols-[782px_333px]">
        <CartItemsSection items={cartItems} onQuantityChange={changeQuantity} />
        <CartSummary subtotal={subtotal} networkFee={networkFee} />
      </div>
      <RelatedProducts title="Colecionadores também viram" />
    </main>
  )
}
