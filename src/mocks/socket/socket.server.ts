import type { toSocketIo } from '@mswjs/socket.io-binding'
import type { NftUpdatedEvent } from '@/types/nft.contracts'

type SocketServer = ReturnType<typeof toSocketIo>['server']
const clients = new Set<SocketServer>()

export function addMockSocket(socket: SocketServer) {
  clients.add(socket)
}

export function removeMockSocket(socket: SocketServer) {
  clients.delete(socket)
}

export function broadcastNftUpdated(event: NftUpdatedEvent) {
  clients.forEach((socket) => socket.emit('nft.updated', event))
}

