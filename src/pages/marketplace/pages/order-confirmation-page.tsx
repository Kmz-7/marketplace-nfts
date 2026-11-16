import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { getOrder } from '@/api/order.api'
import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/hooks/use-auth'
import { OrderConfirmationCard } from '@/pages/marketplace/components/payment/order-confirmation-card'
import { OrderResultState } from '@/pages/marketplace/components/payment/order-result-state'

export function OrderConfirmationPage() {
  const { orderId } = useSearch({ from: '/confirmation' })
  const session = useSession()
  const orderQuery = useQuery({
    queryKey: ['order', session.data?.user?.id ?? 'guest', orderId],
    queryFn: ({ signal }) => getOrder(orderId!, signal),
    enabled: Boolean(orderId),
    retry: false,
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 3000 : false),
  })

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      {orderQuery.isPending && orderId ? (
        <Card className="w-full max-w-lg rounded-lg border-border bg-card p-6">
          <CardContent className="space-y-4 p-0">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto h-6 w-56" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      ) : orderQuery.data?.status === 'confirmed' ? (
        <OrderConfirmationCard order={orderQuery.data} />
      ) : orderQuery.data ? (
        <OrderResultState order={orderQuery.data} />
      ) : (
        <StatusAlert
          className="w-full max-w-lg"
          tone={orderQuery.error ? 'error' : 'info'}
          headingLevel="h1"
          title={orderId ? 'Pedido indisponível' : 'Nenhum pedido selecionado'}
          description={
            orderQuery.error
              ? (orderQuery.error as { response?: { data?: { message?: string } } }).response?.data?.message ??
                'Não foi possível carregar este pedido.'
              : 'A confirmação aparece depois que um pedido é criado.'
          }
          action={<StatusAlertAction render={<Link to="/cart" />}>Voltar ao carrinho</StatusAlertAction>}
        />
      )}
    </main>
  )
}
