import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { useSession } from '@/hooks/use-auth'
import { subscribeToRealtimeEvents } from '@/services/socket'

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const session = useSession()
  const { refreshCart } = useMarketplaceState()

  useEffect(() => {
    return subscribeToRealtimeEvents({
      onNftUpdated: (event) => {
        queryClient.setQueryData(['nft', event.nft.id], event.nft)
        void queryClient.invalidateQueries({ queryKey: ['nfts'] })
        void refreshCart()
      },
      onOrderUpdated: (event) => {
        if (event.order.userId !== session.data?.user?.id) return
        queryClient.setQueryData(['order', event.order.userId, event.order.id], event.order)
        void queryClient.invalidateQueries({ queryKey: ['orders', event.order.userId] })
        if (event.order.status === 'confirmed') void refreshCart()
      },
    })
  }, [queryClient, refreshCart, session.data?.user?.id])

  return children
}
