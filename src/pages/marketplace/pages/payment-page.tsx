import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { items } from '@/pages/marketplace/marketplace-data'
import { CheckoutItemsSummary } from '@/pages/marketplace/components/payment/checkout-items-summary'
import { CollectorProfileForm } from '@/pages/marketplace/components/payment/collector-profile-form'
import { WalletSelector } from '@/pages/marketplace/components/payment/wallet-selector'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'

export function PaymentPage() {
  const navigate = useNavigate()
  const [selectedWallet, setSelectedWallet] = useState('coinbase')
  const checkoutItems = items.slice(0, 3).map((item, index) => ({
    ...item,
    quantity: [2, 6, 9][index],
  }))
  const subtotal = checkoutItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const networkFee = 0.016

  return (
    <main className="py-7 md:py-10">
      <MarketplaceBreadcrumb currentPage="Pagamento" className="mb-8 text-xs md:mb-10" />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        <CollectorProfileForm />
        {/* No Figma, Carteira e rede ficava sem hierarquia; 24 px antes da seção e 12 px entre título, badge e opções destacam o título. */}
        <aside className="space-y-6" aria-label="Resumo e pagamento">
          <CheckoutItemsSummary items={checkoutItems} subtotal={subtotal} networkFee={networkFee} />
          <WalletSelector
            value={selectedWallet}
            onValueChange={setSelectedWallet}
            onConfirm={() => void navigate({ to: '/confirmation' })}
          />
        </aside>
      </div>
    </main>
  )
}
