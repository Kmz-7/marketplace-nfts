import { io } from 'socket.io-client'
import type { NftUpdatedEvent } from '@/types/nft.contracts'

type RealtimeEventHandlers = {
  onNftUpdated: (event: NftUpdatedEvent) => void
}

export function subscribeToRealtimeEvents(handlers: RealtimeEventHandlers) {
  const socketUrl = import.meta.env.VITE_SOCKET_URL
  if (!socketUrl) return () => undefined

  const latestNftVersions = new Map<string, number>()
  const onNftUpdated = (event: NftUpdatedEvent) => {
    if (event.version <= (latestNftVersions.get(event.nft.id) ?? 0)) return
    latestNftVersions.set(event.nft.id, event.version)
    handlers.onNftUpdated(event)
  }
  const socket = io(socketUrl, { path: '/socket.io/', transports: ['websocket'] })

  socket.on('nft.updated', onNftUpdated)

  return () => {
    socket.off('nft.updated', onNftUpdated)
    socket.disconnect()
  }
}
