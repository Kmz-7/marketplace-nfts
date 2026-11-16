import { useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import type { NftUpdatedEvent } from '@/types/nft.contracts'

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL
    if (!socketUrl) return

    const socket = io(socketUrl, { path: '/socket.io/', transports: ['websocket'], reconnection: true })
    const latestNftVersions = new Map<string, number>()
    const onNftUpdated = (event: NftUpdatedEvent) => {
      if (event.version <= (latestNftVersions.get(event.nft.id) ?? 0)) return
      latestNftVersions.set(event.nft.id, event.version)
      queryClient.setQueryData(['nfts', event.nft.id], event.nft)
      void queryClient.invalidateQueries({ queryKey: ['nfts'] })
    }
    const onOrderUpdated = (event: { orderId: string }) => {
      void queryClient.invalidateQueries({ queryKey: ['orders', event.orderId] })
    }
    const onReconnect = () => {
      void queryClient.invalidateQueries({ queryKey: ['nfts'] })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
    }

    socket.on('nft.updated', onNftUpdated)
    socket.on('order.updated', onOrderUpdated)
    socket.io.on('reconnect', onReconnect)

    return () => {
      socket.off('nft.updated', onNftUpdated)
      socket.off('order.updated', onOrderUpdated)
      socket.io.off('reconnect', onReconnect)
      socket.disconnect()
    }
  }, [queryClient])

  return children
}
