import { useState } from 'react'
import type { CartEntry } from '@/components/providers/marketplace-state-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { CartQuoteContract } from '@/types/cart.contracts'
import { multiplyEth } from '@/lib/eth'
import { StatusAlert } from '@/components/status-alert'

type CheckoutItemsSummaryProps = {
  items: CartEntry[]
  quote?: CartQuoteContract
  quotePending: boolean
  quoteError?: string
  couponCode: string
  appliedCoupon: string
  onCouponCodeChange: (value: string) => void
  onApplyCoupon: () => void
}

export function CheckoutItemsSummary({
  items,
  quote,
  quotePending,
  quoteError,
  couponCode,
  appliedCoupon,
  onCouponCodeChange,
  onApplyCoupon,
}: CheckoutItemsSummaryProps) {
  const [isCouponOpen, setIsCouponOpen] = useState(false)

  return (
    <section aria-labelledby="checkout-items-title">
      <h2 id="checkout-items-title" className="text-lg font-semibold">
        Seus NFTs
      </h2>
      <div className="mt-4 mb-4 flex items-center justify-between border-b border-border pb-3 text-md font-medium text-foreground">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>
      {items.length === 0 ? (
        <StatusAlert tone="empty" description="Seu carrinho está vazio. Adicione um NFT antes de continuar." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.lineId}
              className="gap-0 rounded-sm border-0 bg-card py-px pe-3 ps-1 shadow-none ring-0"
            >
              <CardContent className="grid grid-cols-[minmax(0,1fr)_35px_140px] items-center p-0">
                <div className="flex min-w-0 items-center gap-3">
                  {/* No Figma, as miniaturas do pagamento divergiam do carrinho; a classe compartilhada mantém a mesma escala. */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="image-thumbnail shrink-0 rounded-md"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold">{item.name}</h3>
                    {/* Edição e ID do token na mesma linha cortavam o ID; o ID fica na linha de baixo. */}
                    <p className="mt-1 text-xs text-muted-foreground">Edição {item.edition}</p>
                    <p className="text-xs text-muted-foreground">
                      ID do token: <span className="text-primary">{item.tokenId}</span>
                    </p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  (x {item.quantity})
                </span>
                <p className="justify-self-end whitespace-nowrap text-md font-semibold text-primary">
                  {multiplyEth(item.price, item.quantity)} ETH
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-center gap-1 text-md">
        <span>Tem um código promocional?</span>
        <Button
          type="button"
          variant="link"
          onClick={() => setIsCouponOpen((open) => !open)}
          className="h-auto p-0 text-md font-normal text-foreground hover:text-primary"
        >
          {isCouponOpen ? 'Fechar' : 'Aplique aqui'}
        </Button>
      </div>
      {isCouponOpen && (
        <div className="mt-2 flex gap-0">
          <Input
            aria-label="Código promocional"
            placeholder="Digite o código"
            value={couponCode}
            onChange={(event) => onCouponCodeChange(event.target.value)}
            className="rounded-r-none"
          />
          <Button
            type="button"
            onClick={onApplyCoupon}
            disabled={quotePending}
            className="h-9 rounded-l-none rounded-r-lg px-4 text-sm"
          >
            Aplicar
          </Button>
        </div>
      )}
      {quoteError && (
        <StatusAlert className="mt-3" description={quoteError} />
      )}
      <div className="mt-5 space-y-3 text-md">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-lg">{quote?.subtotalEth ?? '—'} ETH</span>
        </p>
        <p className="flex justify-between">
          <span>{appliedCoupon ? `Cupom ${appliedCoupon}` : 'Desconto'}</span>
          <span className="text-md">(−) {quote?.discountEth ?? '—'} ETH</span>
        </p>
        {/* No Figma, “Taxa estimada” ficava solta; ela acompanha a taxa e o total segue as demais margens. */}
        <div className="space-y-1">
          <p className="flex justify-between">
            <span>Taxa de rede</span>
            <span className="text-lg">{quote?.networkFeeEth ?? '—'} ETH</span>
          </p>
          <p className="text-left text-xs text-muted-foreground">Taxa estimada</p>
        </div>
        <p className="flex justify-between gap-5 border-t border-border pt-3 text-md font-bold">
          <span>Total</span>
          <span className="text-primary">{quote?.totalEth ?? '—'} ETH</span>
        </p>
      </div>
      {quotePending && (
        <p role="status" className="mt-3 text-xs text-muted-foreground">
          Atualizando cotação…
        </p>
      )}
    </section>
  )
}
