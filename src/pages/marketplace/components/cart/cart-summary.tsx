import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useSession } from '@/hooks/use-auth'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import type { CartQuoteContract } from '@/types/cart.contracts'
import { StatusAlert } from '@/components/status-alert'

type CartSummaryProps = {
  quote?: CartQuoteContract
  couponCode: string
  appliedCoupon: string
  quotePending: boolean
  quoteError?: string
  onCouponCodeChange: (value: string) => void
  onApplyCoupon: () => void
  disabled?: boolean
  variant?: 'default' | 'mobile'
}

export function CartSummary({
  quote,
  couponCode,
  appliedCoupon,
  quotePending,
  quoteError,
  onCouponCodeChange,
  onApplyCoupon,
  disabled = false,
  variant = 'default',
}: CartSummaryProps) {
  const session = useSession()
  const { openAuthDialog } = useAuthDialog()
  const signedIn = Boolean(session.data?.authenticated)
  const couponInputId = `cart-coupon-${variant}`
  const couponLabelId = `${couponInputId}-label`

  return (
    <Card
      className={
        variant === 'mobile'
          ? '-mx-7 mt-3 flex-none gap-0 rounded-t-3xl rounded-b-none border-0 bg-card px-6 pt-6 pb-9 shadow-xl ring-0'
          : 'mt-4 gap-0 rounded-none border-0 bg-transparent p-0 shadow-none ring-0'
      }
    >
      <CardContent className="p-0">
        <h2 className={`border-b border-border pb-3 text-lg leading-[18px] font-semibold ${variant === 'mobile' ? 'hidden' : ''}`}>
          Resumo da carteira
        </h2>
        <Label id={couponLabelId} variant="cartCoupon" htmlFor={couponInputId} className={`mb-2 ${variant === 'mobile' ? 'sr-only' : ''}`}>
          Código promocional
        </Label>
        {/* No Figma, o campo promocional e a ação Aplicar tinham raios diferentes; o grupo usa o padrão lg. */}
        <InputGroup className={variant === 'mobile' ? 'mt-0 h-12 overflow-hidden rounded-lg border-checkout-border bg-card shadow-lg' : 'mt-1 h-10 overflow-hidden rounded-lg border-primary bg-card'}>
          {/* O rótulo acima já identifica o campo como código promocional; o placeholder pode ficar curto para caber por inteiro. */}
          <InputGroupInput
            id={couponInputId}
            aria-labelledby={couponLabelId}
            placeholder={variant === 'mobile' ? 'Digite o código promocional...' : 'Digite o código'}
            value={couponCode}
            onChange={(event) => onCouponCodeChange(event.target.value)}
            className={`h-full rounded-none border-0 bg-transparent px-3 text-sm leading-4 focus-visible:ring-0 ${variant === 'mobile' ? 'pl-4 placeholder:text-xs placeholder:text-muted-foreground/70' : ''}`}
          />
          <InputGroupButton
            type="button"
            variant={variant === 'mobile' ? 'gradient' : 'default'}
            className={variant === 'mobile' ? 'h-full px-5 text-md' : 'h-full rounded-none border-l border-primary px-4 text-sm leading-4'}
            disabled={quotePending}
            onClick={onApplyCoupon}
          >
            Aplicar
          </InputGroupButton>
        </InputGroup>
        {quoteError && (
          <StatusAlert className="mt-2" description={quoteError} />
        )}
        {/* No Figma mobile, rótulos de 15 px; em 390 px usam sm para "Desconto do lançamento" caber ao lado do valor. */}
        <div className={`${variant === 'mobile' ? 'mt-4 space-y-3 text-sm leading-5' : 'mt-6 space-y-3 text-md leading-5'}`}>
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{quote?.subtotalEth ?? '—'} ETH</span>
          </p>
          <p className="flex justify-between">
            <span>{variant === 'mobile' ? 'Desconto do lançamento' : 'Desconto'}</span>
            <span>(−) {quote?.discountEth ?? '—'} ETH</span>
          </p>
          <p className="flex justify-between">
            <span>Taxa de rede</span>
            <span>{quote?.networkFeeEth ?? '—'} ETH</span>
          </p>
          {/* Desktop: no Figma a taxa estimada ficava solta à direita e foi alinhada aos rótulos. Mobile: o Figma a agrupa sob o valor, à direita. */}
          <p className={`text-xs text-link ${variant === 'mobile' ? '-mt-3 text-right' : 'text-left'}`}>Taxa estimada</p>
          <p className={`flex items-baseline justify-between pt-2 font-bold ${variant === 'mobile' ? 'text-md leading-5' : 'text-lg leading-5'}`}>
            <span>Total</span>
            <span className={variant === 'mobile' ? 'text-lg text-link' : 'text-primary'}>{quote?.totalEth ?? '—'} ETH</span>
          </p>
        </div>
        {quotePending && !disabled && <p role="status" className="mt-3 text-xs text-muted-foreground">Atualizando cotação…</p>}
        {signedIn ? (
          <Button
            render={<Link to="/payment" search={{ coupon: appliedCoupon || undefined }} />}
            variant={variant === 'mobile' ? 'gradient' : 'default'}
            size={variant === 'mobile' ? 'cta' : 'default'}
            className={variant === 'mobile' ? 'mt-6' : 'mt-5 h-10 w-full rounded-lg text-sm leading-4'}
            disabled={disabled || quotePending || !quote || Boolean(quoteError)}
          >
            Finalizar
          </Button>
        ) : (
          <Button
            type="button"
            variant={variant === 'mobile' ? 'gradient' : 'default'}
            size={variant === 'mobile' ? 'cta' : 'default'}
            className={variant === 'mobile' ? 'mt-6' : 'mt-5 h-10 w-full rounded-lg text-sm leading-4'}
            disabled={disabled || quotePending || !quote || Boolean(quoteError)}
            onClick={() => openAuthDialog({ continueToPayment: true, coupon: appliedCoupon || undefined })}
          >
            {/* O Figma apresentava uma conexão direta; o modal mantém o carrinho visível durante a autenticação. */}
            Conectar e finalizar
          </Button>
        )}
        <Button
          render={<Link to="/" />}
          variant="link"
          className={`mt-2 h-8 w-full text-sm leading-4 text-primary ${variant === 'mobile' ? 'hidden' : ''}`}
        >
          Continuar explorando
        </Button>
      </CardContent>
    </Card>
  )
}
