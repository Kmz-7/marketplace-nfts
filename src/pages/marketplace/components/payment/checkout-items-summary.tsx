import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { items } from '@/pages/marketplace/marketplace-data'

type CheckoutItem = (typeof items)[number] & { quantity: number }

type CheckoutItemsSummaryProps = {
  items: CheckoutItem[]
  subtotal: number
  networkFee: number
}

export function CheckoutItemsSummary({ items, subtotal, networkFee }: CheckoutItemsSummaryProps) {
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
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card
            key={item.name}
            className="gap-0 rounded-sm border-0 bg-card py-px pe-3 ps-1 shadow-none ring-0"
          >
            <CardContent className="grid grid-cols-[minmax(0,1fr)_35px_140px] items-center p-0">
              <div className="flex min-w-0 items-center gap-3">
                {/* O Figma usava três dimensões diferentes para a mesma miniatura; o tamanho compartilhado mantém cada linha alinhada. */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="image-thumbnail shrink-0 rounded-md"
                />
                <div className="min-w-0 flex-1">
                  {/* No Figma, o nome do NFT alternava de escala entre itens; todos seguem o tamanho lg dos títulos. */}
                  <h3 className="truncate text-lg font-semibold">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ID do token:{' '}
                    <span className="text-primary">#{['0042', '0314', '0088'][index]}</span>
                  </p>
                </div>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                (x {item.quantity})
              </span>
              <p className="justify-self-end whitespace-nowrap text-md font-semibold text-primary">
                {(Number(item.price) * item.quantity).toFixed(2)} ETH
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1 text-md">
        <span>Tem um código promocional?</span>
        <Button
          type="button"
          variant="link"
          onClick={() => setIsCouponOpen((open) => !open)}
          className="h-auto p-0 text-md font-normal text-foreground hover:text-primary"
        >
          Aplique aqui
        </Button>
      </div>
      {isCouponOpen && (
        <div className="mt-2 flex">
          <Input aria-label="Código promocional" variant="checkoutCoupon" />
          <Button type="button" className="h-9 rounded-l-none px-4 text-sm">
            Aplicar
          </Button>
        </div>
      )}
      <div className="mt-5 space-y-3 text-md">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-lg">{subtotal.toFixed(2)} ETH</span>
        </p>
        <p className="flex justify-between">
          <span>Desconto do lançamento</span>
          <span className="text-md">(−) 0.00 ETH</span>
        </p>
        {/* No Figma, “Taxa estimada” ficava isolada e centralizada; como descrição ela acompanha a taxa e o total mantém as margens da lista. */}
        <div className="space-y-1">
          <p className="flex justify-between">
            <span>Taxa de rede</span>
            <span className="text-lg">{networkFee.toFixed(3)} ETH</span>
          </p>
          <p className="text-left text-xs text-muted-foreground">Taxa estimada</p>
        </div>
        <p className="flex justify-between gap-5 border-t border-border pt-3 text-md font-bold">
          <span>Total</span>
          <span className="text-primary">{(subtotal + networkFee).toFixed(3)} ETH</span>
        </p>
      </div>
    </section>
  )
}
