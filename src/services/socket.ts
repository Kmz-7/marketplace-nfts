import type { Socket } from 'socket.io-client'
import type { NftUpdatedEvent } from '@/types/nft.contracts'
import type { OrderUpdatedEventContract } from '@/types/order.contracts'
import { getAuthToken } from '@/lib/auth-token'
import { waitForMockWorker } from '@/lib/mock-runtime'

type RealtimeEventHandlers = {
  onNftUpdated: (event: NftUpdatedEvent) => void
  onOrderUpdated: (event: OrderUpdatedEventContract) => void
}

export function subscribeToRealtimeEvents(handlers: RealtimeEventHandlers) {
  // O mock precisa compartilhar a origem da página para funcionar também em HTTPS na Vercel.
  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin

  const latestNftVersions = new Map<string, number>()
  const latestOrderVersions = new Map<string, number>()
  const onNftUpdated = (event: NftUpdatedEvent) => {
    if (event.version <= (latestNftVersions.get(event.nft.id) ?? 0)) return
    latestNftVersions.set(event.nft.id, event.version)
    handlers.onNftUpdated(event)
  }
  const accessToken = getAuthToken()
  const onOrderUpdated = (event: OrderUpdatedEventContract) => {
    if (event.version <= (latestOrderVersions.get(event.order.id) ?? 0)) return
    latestOrderVersions.set(event.order.id, event.version)
    handlers.onOrderUpdated(event)
  }

  let socket: Socket | undefined
  let disposed = false
  void waitForMockWorker().then(async () => {
    if (disposed) return
    // The socket client is loaded only after the mock worker is ready, keeping it out of the initial mobile bundle.
    const { io } = await import('socket.io-client')
    if (disposed) return
    socket = io(socketUrl, {
      path: '/socket.io/',
      transports: ['websocket'],
      query: accessToken ? { access_token: accessToken } : undefined,
    })
    socket.on('nft.updated', onNftUpdated)
    socket.on('order.updated', onOrderUpdated)
  })

  return () => {
    disposed = true
    socket?.off('nft.updated', onNftUpdated)
    socket?.off('order.updated', onOrderUpdated)
    socket?.disconnect()
  }
}
