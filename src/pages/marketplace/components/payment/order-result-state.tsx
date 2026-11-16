import { Link } from '@tanstack/react-router'
import { AlertCircle, Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { OrderContract } from '@/types/order.contracts'

export function OrderResultState({ order }: { order: OrderContract }) {
  const declined = order.status === 'declined'

  return (
    <Card className="w-full max-w-lg rounded-lg border-border bg-card p-6">
      <CardContent className="flex flex-col items-center p-0 text-center">
        {declined ? (
          <AlertCircle className="size-8 text-primary" aria-hidden="true" />
        ) : (
          <Clock3 className="size-8 text-primary" aria-hidden="true" />
        )}
        <h1 className="mt-4 text-lg font-semibold">
          {declined ? 'Não foi possível confirmar a compra' : 'Pagamento em processamento'}
        </h1>
        <p role="status" className="mt-3 text-sm leading-6 text-muted-foreground">
          {declined
            ? 'O pagamento foi recusado na simulação. Seus itens continuam no carrinho para uma nova tentativa.'
            : 'O pedido foi recebido, mas ainda aguarda confirmação. Seus itens permanecem associados a esta compra.'}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Pedido {order.id}</p>
        <Button
          render={<Link to="/cart" />}
          width="mobile"
          className="mt-5 h-10 rounded-lg px-5 text-sm"
        >
          Voltar ao carrinho
        </Button>
      </CardContent>
    </Card>
  )
}
