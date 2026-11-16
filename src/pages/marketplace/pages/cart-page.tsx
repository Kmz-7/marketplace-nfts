import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getCartQuote } from '@/api/cart.api'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-auth'
import { CartItemsSection } from '@/pages/marketplace/components/cart/cart-items-section'
import { CartSummary } from '@/pages/marketplace/components/cart/cart-summary'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { DeferredRelatedProducts } from '@/pages/marketplace/components/deferred-related-products'
import { MobileMarketplaceHeader } from '@/pages/marketplace/components/mobile-marketplace-header'

export function CartPage() {
  const navigate = useNavigate()
  const marketplace = useMarketplaceState()
  const session = useSession()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const { cart: cartItems } = marketplace
  const cartVersion = cartItems
    .map((item) => `${item.lineId}:${item.quantity}:${item.price}:${item.availableQuantity}:${item.available}`)
    .join('|')
  const quoteQuery = useQuery({
    queryKey: ['cart-quote', session.data?.user?.id ?? 'guest', cartVersion, appliedCoupon],
    queryFn: ({ signal }) =>
      getCartQuote({ couponCode: appliedCoupon || undefined, network: 'ethereum' }, signal),
    enabled: cartItems.length > 0,
  })
  const quoteError = quoteQuery.error
    ? (
        quoteQuery.error as {
          response?: { data?: { message?: string } }
        }
      ).response?.data?.message ?? 'Não foi possível calcular a cotação. Tente novamente.'
    : undefined
  const handleQuantityChange = (id: string, amount: number) => {
    void marketplace.changeCartQuantity(id, amount).catch(() => {
      toast.error('Não foi possível atualizar a quantidade. Tente novamente.')
    })
  }
  const handleRemove = (id: string) => {
    void marketplace.removeFromCart(id).catch(() => {
      toast.error('Não foi possível remover o NFT. Tente novamente.')
    })
  }

  return (
    <main className="-mx-4 h-dvh overflow-hidden bg-background px-7 pt-6 md:mx-0 md:h-auto md:overflow-visible md:bg-transparent md:px-0 md:pt-0">
      {/* Mobile/Carrinho de NFTs prende o resumo no rodapé e deixa a lista rolar dentro da área restante. */}
      <section className="flex h-full min-h-0 flex-col md:hidden">
        <MobileMarketplaceHeader title="Carrinho de NFTs" onBack={() => void navigate({ to: '/' })} />
        <div className="min-h-0 flex-1 overflow-y-auto pt-4">
          <CartItemsSection
            items={cartItems}
            mobileFrame
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        </div>
        <CartSummary
          quote={quoteQuery.data}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          quotePending={quoteQuery.isPending || quoteQuery.isFetching}
          quoteError={quoteError}
          onCouponCodeChange={setCouponCode}
          onApplyCoupon={() => setAppliedCoupon(couponCode.trim())}
          disabled={cartItems.length === 0}
          variant="mobile"
        />
      </section>

      <section className="hidden md:block">
        <div className="py-8 md:py-10">
          <MarketplaceBreadcrumb currentPage="Carrinho" className="text-xs" />
          {/* O Figma deixava uma distância excessiva entre tabela e resumo; a grade compacta mantém o painel próximo sem comprimir a tabela em notebook. */}
          <div className="grid items-start gap-8 xl:grid-cols-[782px_333px] xl:gap-8">
            <CartItemsSection
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
            <CartSummary
              quote={quoteQuery.data}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              quotePending={quoteQuery.isPending || quoteQuery.isFetching}
              quoteError={quoteError}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={() => setAppliedCoupon(couponCode.trim())}
              disabled={cartItems.length === 0}
            />
          </div>
          <DeferredRelatedProducts title="Colecionadores também viram" />
        </div>
      </section>
    </main>
  )
}
