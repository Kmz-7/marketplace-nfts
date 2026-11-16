import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { addMockSocket, removeMockSocket } from '@/mocks/socket/socket.server'

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
const socketLink = ws.link(`${socketUrl.replace(/^http/, 'ws').replace(/\/$/, '')}/socket.io/`)

export const socketHandlers = [
  socketLink.addEventListener('connection', (connection) => {
    const socket = toSocketIo(connection)
    addMockSocket(socket.server)
    connection.client.addEventListener('close', () => removeMockSocket(socket.server))
  }),
]
