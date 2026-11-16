import type { toSocketIo } from '@mswjs/socket.io-binding'
import type { NftUpdatedEvent } from '@/types/nft.contracts'
import type { OrderUpdatedEventContract } from '@/types/order.contracts'
import { getMockSession } from '@/mocks/state/auth.store'

type MockSocketClient = ReturnType<typeof toSocketIo>['client']
const clients = new Map<MockSocketClient, string | null>()

export function addMockSocket(socket: MockSocketClient, accessToken: string | null) {
  clients.set(socket, accessToken)
}

export function removeMockSocket(socket: MockSocketClient) {
  clients.delete(socket)
}

export function broadcastNftUpdated(event: NftUpdatedEvent) {
  clients.forEach((_, socket) => socket.emit('nft.updated', event))
}

export function broadcastOrderUpdated(event: OrderUpdatedEventContract) {
  clients.forEach((accessToken, socket) => {
    const session = getMockSession(accessToken)
    if (session.authenticated && session.user?.id === event.order.userId) {
      socket.emit('order.updated', event)
    }
  })
}

