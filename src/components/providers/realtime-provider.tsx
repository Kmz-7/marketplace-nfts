import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { subscribeToRealtimeEvents } from '@/services/socket'

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    return subscribeToRealtimeEvents({
      onNftUpdated: (event) => {
        queryClient.setQueryData(['nft', event.nft.id], event.nft)
        void queryClient.invalidateQueries({ queryKey: ['nfts'] })
      },
    })
  }, [queryClient])

  return children
}
