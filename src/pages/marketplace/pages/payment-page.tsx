import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { createOrder } from '@/api/order.api'
import { getCartQuote } from '@/api/cart.api'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { CheckoutItemsSummary } from '@/pages/marketplace/components/payment/checkout-items-summary'
import { CollectorProfileForm } from '@/pages/marketplace/components/payment/collector-profile-form'
import { WalletSelector } from '@/pages/marketplace/components/payment/wallet-selector'
import { MobilePaymentView } from '@/pages/marketplace/components/payment/mobile-payment-view'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import type { CreateOrderRequestContract } from '@/types/order.contracts'

type PaymentNetwork = CreateOrderRequestContract['network']
type PaymentWallet = CreateOrderRequestContract['wallet']

function apiErrorMessage(error: unknown) {
  return (
    error as { response?: { data?: { message?: string } } }
  ).response?.data?.message ?? 'Não foi possível concluir a compra. Tente novamente.'
}

export function PaymentPage() {
  const navigate = useNavigate()
  const { coupon } = useSearch({ from: '/payment' })
  const session = useSession()
  const marketplace = useMarketplaceState()
  const [selectedWallet, setSelectedWallet] = useState<PaymentWallet>('coinbase')
  const [selectedNetwork, setSelectedNetwork] = useState<PaymentNetwork>('ethereum')
  const [couponCode, setCouponCode] = useState(coupon ?? '')
  const [appliedCoupon, setAppliedCoupon] = useState(coupon ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cartItems = marketplace.cart
  const cartVersion = cartItems
    .map((item) => `${item.lineId}:${item.quantity}:${item.price}:${item.availableQuantity}:${item.available}`)
    .join('|')
  const quoteQuery = useQuery({
    queryKey: ['cart-quote', session.data?.user?.id ?? 'guest', cartVersion, appliedCoupon, selectedNetwork],
    queryFn: ({ signal }) =>
      getCartQuote(
        { couponCode: appliedCoupon || undefined, network: selectedNetwork },
        signal,
      ),
    enabled: cartItems.length > 0,
    retry: false,
  })
  const quoteError = quoteQuery.error ? apiErrorMessage(quoteQuery.error) : undefined

  async function handleConfirm() {
    const quote = quoteQuery.data
    if (!quote || quoteError || isSubmitting || cartItems.length === 0) return

    setIsSubmitting(true)
    const request: CreateOrderRequestContract = {
      quoteId: quote.id,
      wallet: selectedWallet,
      network: selectedNetwork,
    }
    const idempotencyKey = crypto.randomUUID()

    try {
      let order
      try {
        order = await createOrder(request, idempotencyKey)
      } catch (error) {
        // Reenvia a mesma chave após timeout para recuperar o mesmo pedido sem duplicar a compra.
        if ((error as { response?: { status?: number } }).response?.status !== 504) throw error
        order = await createOrder(request, idempotencyKey)
      }

      if (order.status === 'confirmed') {
        await marketplace.clearCart()
      }
      void navigate({ to: '/confirmation', search: { orderId: order.id } })
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status
      if (status === 409) {
        await quoteQuery.refetch()
      }
      toast.error(apiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <MobilePaymentView
        totalEth={quoteQuery.data?.totalEth}
        quotePending={quoteQuery.isPending || quoteQuery.isFetching}
        quoteError={quoteError}
        value={selectedWallet}
        onValueChange={setSelectedWallet}
        onConfirm={() => void handleConfirm()}
        onBack={() => void navigate({ to: '/cart' })}
        pending={isSubmitting}
        disabled={
          cartItems.length === 0 ||
          quoteQuery.isPending ||
          quoteQuery.isFetching ||
          !quoteQuery.data ||
          Boolean(quoteError)
        }
      />
      <main className="hidden py-7 md:block md:py-10">
        <MarketplaceBreadcrumb currentPage="Pagamento" className="mb-8 text-xs md:mb-10" />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
          <CollectorProfileForm
            network={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
          />
          {/* No Figma, Carteira e rede ficava sem hierarquia; 24 px antes da seção e 12 px entre título, badge e opções destacam o título. */}
          <aside className="space-y-6" aria-label="Resumo e pagamento">
            <CheckoutItemsSummary
              items={cartItems}
              quote={quoteQuery.data}
              quotePending={quoteQuery.isPending || quoteQuery.isFetching}
              quoteError={quoteError}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              onCouponCodeChange={setCouponCode}
              onApplyCoupon={() => setAppliedCoupon(couponCode.trim())}
            />
            <WalletSelector
              value={selectedWallet}
              onValueChange={setSelectedWallet}
              onConfirm={() => void handleConfirm()}
              pending={isSubmitting}
              disabled={
                cartItems.length === 0 ||
                quoteQuery.isPending ||
                quoteQuery.isFetching ||
                !quoteQuery.data ||
                Boolean(quoteError)
              }
            />
            {cartItems.length === 0 && (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-lg"
                onClick={() => void navigate({ to: '/cart' })}
              >
                Voltar ao carrinho
              </Button>
            )}
          </aside>
        </div>
      </main>
    </>
  )
}
