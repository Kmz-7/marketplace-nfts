import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { addMockSocket, removeMockSocket } from '@/mocks/socket/socket.server'

// O mock e o socket cliente usam a mesma origem para funcionar em preview e no deploy HTTPS.
const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
// O MSW remove o prefixo /socket.io/ antes de comparar o handler; por isso o link corresponde à raiz.
const socketLink = ws.link(`${socketUrl.replace(/^http/, 'ws').replace(/\/$/, '')}/`)

export const socketHandlers = [
  socketLink.addEventListener('connection', (connection) => {
    const socket = toSocketIo(connection)
    const accessToken = connection.client.url.searchParams.get('access_token')
    addMockSocket(socket.client, accessToken)
    connection.client.addEventListener('close', () => removeMockSocket(socket.client))
  }),
]
