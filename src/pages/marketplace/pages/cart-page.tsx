import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { CartItemsSection } from '@/pages/marketplace/components/cart/cart-items-section'
import { CartSummary } from '@/pages/marketplace/components/cart/cart-summary'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { RelatedProducts } from '@/pages/marketplace/components/related-products'

export function CartPage() {
  const marketplace = useMarketplaceState()
  const { cart: cartItems } = marketplace
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const networkFee = cartItems.length > 0 ? 0.016 : 0

  return (
    <main className="py-8 md:py-10">
      <MarketplaceBreadcrumb currentPage="Carrinho" className="text-xs" />
      {/* O Figma deixava uma distância excessiva entre tabela e resumo; a grade compacta mantém o painel próximo sem comprimir a tabela em notebook. */}
      <div className="grid items-start gap-8 xl:grid-cols-[782px_333px] xl:gap-8">
        <CartItemsSection
          items={cartItems}
          onQuantityChange={marketplace.changeCartQuantity}
          onRemove={marketplace.removeFromCart}
        />
        <CartSummary subtotal={subtotal} networkFee={networkFee} disabled={cartItems.length === 0} />
      </div>
      <RelatedProducts title="Colecionadores também viram" />
    </main>
  )
}
