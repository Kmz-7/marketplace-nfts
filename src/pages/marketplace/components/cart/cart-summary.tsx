import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

type CartSummaryProps = { subtotal: number; networkFee: number }

export function CartSummary({ subtotal, networkFee }: CartSummaryProps) {
  return (
    <Card className="gap-0 rounded-none border-0 bg-transparent p-0 mt-4 shadow-none ring-0">
      <CardContent className="p-0">
        <h2 className="border-b border-border pb-3 text-lg leading-[18px] font-semibold">
          Resumo da carteira
        </h2>
        <Label variant="cartCoupon" htmlFor="cart-coupon" className="mb-2">
          Código promocional
        </Label>
        <InputGroup className="mt-1 h-10 overflow-hidden rounded-sm border-primary bg-card">
          <InputGroupInput
            id="cart-coupon"
            placeholder="Digite o código promocional..."
            className="h-full rounded-none border-0 bg-transparent px-3 text-sm leading-4 focus-visible:ring-0"
          />
          <InputGroupButton
            type="button"
            variant="default"
            className="h-full rounded-none border-l border-primary px-4 text-sm leading-4"
          >
            Aplicar
          </InputGroupButton>
        </InputGroup>
        <div className="mt-6 space-y-3 text-sm leading-5">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} ETH</span>
          </p>
          <p className="flex justify-between">
            <span>Desconto do lançamento</span>
            <span>(−) 0.00 ETH</span>
          </p>
          <p className="flex justify-between">
            <span>Taxa de rede</span>
            <span>{networkFee.toFixed(3)} ETH</span>
          </p>
          <p className="text-right text-xs text-primary">Taxa estimada</p>
          <p className="flex justify-between pt-2 text-lg leading-5 font-bold">
            <span>Total</span>
            <span className="text-primary">{(subtotal + networkFee).toFixed(3)} ETH</span>
          </p>
        </div>
        <Button
          render={<Link to="/payment" />}
          className="mt-5 h-10 w-full rounded-sm text-sm leading-4"
        >
          Conectar e finalizar
        </Button>
        <Button
          render={<Link to="/" />}
          variant="link"
          className="mt-2 h-8 w-full text-sm leading-4 text-primary"
        >
          Continuar explorando
        </Button>
      </CardContent>
    </Card>
  )
}
