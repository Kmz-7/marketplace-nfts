import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useSession } from '@/hooks/use-auth'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'

type CartSummaryProps = { subtotal: number; networkFee: number; disabled?: boolean }

export function CartSummary({ subtotal, networkFee, disabled = false }: CartSummaryProps) {
  const session = useSession()
  const { openAuthDialog } = useAuthDialog()
  const signedIn = Boolean(session.data?.authenticated)

  return (
    <Card className="gap-0 rounded-none border-0 bg-transparent p-0 mt-4 shadow-none ring-0">
      <CardContent className="p-0">
        <h2 className="border-b border-border pb-3 text-lg leading-[18px] font-semibold">
          Resumo da carteira
        </h2>
        <Label variant="cartCoupon" htmlFor="cart-coupon" className="mb-2">
          Código promocional
        </Label>
        {/* No Figma, o campo promocional e a ação Aplicar tinham raios diferentes; o grupo usa o padrão lg. */}
        <InputGroup className="mt-1 h-10 overflow-hidden rounded-lg border-primary bg-card">
          {/* O rótulo acima já identifica o campo como código promocional; o placeholder pode ficar curto para caber por inteiro. */}
          <InputGroupInput
            id="cart-coupon"
            placeholder="Digite o código"
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
        <div className="mt-6 space-y-3 text-md leading-5">
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
        {signedIn ? (
          <Button
            render={<Link to="/payment" />}
            className="mt-5 h-10 w-full rounded-lg text-sm leading-4"
            disabled={disabled}
          >
            Finalizar
          </Button>
        ) : (
          <Button
            type="button"
            className="mt-5 h-10 w-full rounded-lg text-sm leading-4"
            disabled={disabled}
            onClick={() => openAuthDialog({ continueToPayment: true })}
          >
            {/* O Figma apresentava uma conexão direta; o modal mantém o carrinho visível durante a autenticação. */}
            Conectar e finalizar
          </Button>
        )}
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
